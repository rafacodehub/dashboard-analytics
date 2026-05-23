# Dashboard ABC Enterprise — V14

## Como rodar

```bash
npm install
npm start
```

Depois abra:

```bash
http://localhost:3000
```

## Banco de dados

O SQLite será criado automaticamente em:

```bash
backend/data/dashboard.sqlite
```

## Principais endpoints

```txt
GET  /api/health
POST /api/sync
POST /api/import/preview
POST /api/import/commit
POST /api/import/rollback
GET  /api/reports
GET  /api/ai/insights
POST /api/export/pdf
GET  /api/export/verify/:id
```

## Modelo Excel

No painel Relatórios, use o botão **Modelo completo** ou **Baixar modelo**.
O arquivo terá abas para:

- KPIs
- Mensal
- Relatórios
- Benchmark
- Despesas

## Observação

Este projeto usa SQLite por padrão para facilitar testes locais. Para produção, a camada `backend/db.js` pode ser trocada por PostgreSQL, MySQL, Supabase ou Firebase.
