import { existsSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs'

const outcome = process.argv[2] ?? 'unknown'
const output = existsSync('build.log') ? readFileSync('build.log', 'utf8') : 'The build did not produce a log.'
const warnings = output.split('\n').filter((line) => line.startsWith('warn:'))
const report = { checkedAt: new Date().toISOString(), outcome, warnings, output }
writeFileSync('build-report.json', JSON.stringify(report, null, 2) + '\n')
const summary = [
  '## Catalog build',
  '',
  `Result: **${outcome}**. Discovery warnings: **${warnings.length}**.`,
  '',
  'The build log and JSON report are attached as the `catalog-build-report` artifact.',
  'This checks delivery and page metadata. It does not measure Google indexing or AI citations.',
  '',
  '<details><summary>Build output</summary>',
  '',
  '```text',
  output.slice(-20000).replaceAll('```', "'''"),
  '```',
  '',
  '</details>',
  '',
].join('\n')
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary)
else console.log(summary)
