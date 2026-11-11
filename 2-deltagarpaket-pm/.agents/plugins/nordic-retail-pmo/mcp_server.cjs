#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");

const STATE_FILE = path.join(__dirname, "pmo_state.json");

function readState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
  } catch {
    return {
      project: "Projekt OmniPOS v4.2 – Nordic Retail AB",
      lastUpdated: new Date().toISOString(),
      tickets: [],
    };
  }
}

function writeState(nextState) {
  nextState.lastUpdated = new Date().toISOString();
  const tmpFile = `${STATE_FILE}.tmp.${process.pid}.${Date.now()}`;
  fs.writeFileSync(tmpFile, JSON.stringify(nextState, null, 2), "utf-8");
  fs.renameSync(tmpFile, STATE_FILE);
}

const TOOLS = [
  {
    name: "list_pmo_tickets",
    description:
      "Listar registrerade risker, incidenter och eskaleringsärenden i Nordic Retails PMO-system för Projekt OmniPOS.",
    inputSchema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          description: "Valfritt filter på status: OPEN, ESCALATED_TO_STEERCO, MITIGATED eller CLOSED.",
        },
      },
    },
  },
  {
    name: "create_escalation_ticket",
    description:
      "Skapar ett nytt eskalerings- eller riskärende i PMO-systemet (sparas direkt i pmo_state.json med nytt PMO-ID).",
    inputSchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Kort, tydlig rubrik på eskaleringen eller risken.",
        },
        severity: {
          type: "string",
          enum: ["P1_CRITICAL", "P2_HIGH", "P3_MEDIUM"],
          description: "Allvarlighetsgrad.",
        },
        affectedStores: {
          type: "array",
          items: { type: "string" },
          description: "Lista med berörda ButiksID (t.ex. ['NR-025', 'NR-026']).",
        },
        financialRiskSek: {
          type: "number",
          description: "Uppskattad finansiell risk eller straffavgift i SEK.",
        },
        owner: {
          type: "string",
          description: "Ansvarig person eller roll.",
        },
        recommendedAction: {
          type: "string",
          description: "Rekommenderat beslut eller åtgärd till styrgruppen.",
        },
      },
      required: ["title", "severity", "owner", "recommendedAction"],
    },
  },
  {
    name: "update_ticket_status",
    description: "Uppdaterar status och kommentar på ett befintligt PMO-ärende (t.ex. PMO-102).",
    inputSchema: {
      type: "object",
      properties: {
        ticketId: {
          type: "string",
          description: "Ärendets ID, t.ex. PMO-102.",
        },
        status: {
          type: "string",
          enum: ["OPEN", "ESCALATED_TO_STEERCO", "MITIGATED", "CLOSED"],
        },
        note: {
          type: "string",
          description: "Notering om genomförd åtgärd eller beslut.",
        },
      },
      required: ["ticketId", "status"],
    },
  },
];

function okResult(id, payload) {
  return {
    jsonrpc: "2.0",
    id,
    result: {
      content: [
        {
          type: "text",
          text: JSON.stringify(payload, null, 2),
        },
      ],
    },
  };
}

function errResult(id, code, message) {
  return {
    jsonrpc: "2.0",
    id,
    error: { code, message },
  };
}

function handleRpc(msg) {
  const id = msg.id !== undefined ? msg.id : null;
  const method = typeof msg.method === "string" ? msg.method : "";
  const params = msg.params && typeof msg.params === "object" ? msg.params : {};

  if (method === "notifications/initialized" || method.startsWith("notifications/")) {
    return null;
  }

  if (method === "ping") {
    return { jsonrpc: "2.0", id, result: {} };
  }

  if (method === "initialize") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: {
          name: "nordic-retail-pmo",
          version: "1.0.0",
        },
      },
    };
  }

  if (method === "tools/list") {
    return {
      jsonrpc: "2.0",
      id,
      result: { tools: TOOLS },
    };
  }

  if (method === "tools/call") {
    const toolName = typeof params.name === "string" ? params.name : "";
    const args = params.arguments && typeof params.arguments === "object" ? params.arguments : {};
    const state = readState();

    if (toolName === "list_pmo_tickets") {
      const tickets = args.status
        ? state.tickets.filter((t) => t.status === args.status)
        : state.tickets;
      const totalRiskSek = tickets
        .filter((t) => t.status === "OPEN" || t.status === "ESCALATED_TO_STEERCO")
        .reduce((sum, t) => sum + (Number(t.financialRiskSek) || 0), 0);
      return okResult(id, {
        project: state.project,
        lastUpdated: state.lastUpdated,
        count: tickets.length,
        openFinancialExposureSek: totalRiskSek,
        tickets,
      });
    }

    if (toolName === "create_escalation_ticket") {
      const maxNum = state.tickets.reduce((max, t) => {
        const m = /^PMO-(\d+)$/.exec(t.id || "");
        return m ? Math.max(max, Number(m[1])) : max;
      }, 100);
      const newTicket = {
        id: `PMO-${maxNum + 1}`,
        type: "ESCALATION",
        severity: args.severity || "P2_HIGH",
        status: "ESCALATED_TO_STEERCO",
        title: String(args.title || "Namnlöst ärende"),
        affectedStores: Array.isArray(args.affectedStores) ? args.affectedStores : [],
        financialRiskSek: Number(args.financialRiskSek) || 0,
        owner: String(args.owner || "PMO"),
        createdAt: new Date().toISOString().slice(0, 10),
        recommendedAction: String(args.recommendedAction || ""),
      };
      state.tickets.push(newTicket);
      writeState(state);
      return okResult(id, {
        created: true,
        ticket: newTicket,
        message: `Ärende ${newTicket.id} skapat och eskalerat till Styrgruppen.`,
      });
    }

    if (toolName === "update_ticket_status") {
      const ticket = state.tickets.find((t) => t.id === args.ticketId);
      if (!ticket) {
        return errResult(id, -32602, `Hittade inget ärende med ID ${args.ticketId}`);
      }
      ticket.status = args.status;
      if (args.note) {
        ticket.resolutionNote = String(args.note);
      }
      writeState(state);
      return okResult(id, { updated: true, ticket });
    }

    return errResult(id, -32601, `Okänt verktyg: ${toolName}`);
  }

  return errResult(id, -32601, `Okänd metod: ${method}`);
}

const rl = readline.createInterface({ input: process.stdin, terminal: false });
rl.on("line", (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    const parsed = JSON.parse(trimmed);
    const response = handleRpc(parsed);
    if (response) {
      process.stdout.write(`${JSON.stringify(response)}\n`);
    }
  } catch (err) {
    process.stdout.write(
      `${JSON.stringify(errResult(null, -32700, err instanceof Error ? err.message : "Parse error"))}\n`
    );
  }
});
