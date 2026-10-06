# Mini SOC Lab

A lightweight Security Operations Center (SOC) monitoring and incident triage lab built with Python, Flask, and React.

This project simulates security events locally and demonstrates core defensive security concepts including log analysis, detection engineering, alert generation, incident investigation, and analyst workflow.

## Features

- SSH authentication log analysis
- SSH brute-force detection
- Detection of successful login after repeated failures
- Privileged `sudo` activity detection
- Sensitive system file modification detection
- Critical / High / Medium severity classification
- JSON-based security alert storage
- Flask REST API
- React SOC monitoring dashboard
- Automatic alert refresh every 10 seconds
- Severity-based alert filtering
- Alert severity visualization
- Alert investigation panel
- Incident workflow:
  `Open → Investigating → Resolved`
- Persistent incident status updates
- Monitoring status and last-updated timestamp

## Architecture

```text
                 Simulated Security Events
                           │
                           ▼
                      auth.log
                           │
                           ▼
                 Python Detection Engine
                    log_analyzer.py
                           │
                           ▼
                    alerts.json
                           │
                           ▼
                    Flask REST API
                         api.py
                           │
                           ▼
                  React SOC Dashboard
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
      Alert Monitoring           Analyst Investigation
      Severity / Filters          Status Workflow
                                  Open → Investigating
                                  → Resolved

### Dashboard screenshots




## Detection Rules

| Detection | Trigger | Severity | Recommended Action |
|---|---|---|---|
| SSH brute force | 5+ failed authentication attempts from the same source IP | High | Investigate source IP and affected account |
| Repeated authentication failures | 3–4 failed attempts from the same source IP | Medium | Monitor source IP |
| Successful login after repeated failures | Successful login from an IP with 3+ previous failures | Critical | Investigate account activity and source IP |
| Privileged command execution | `sudo` event using `USER=root` | High | Verify whether privileged activity was authorized |
| Sensitive file modification | Modification of `/etc/passwd`, `/etc/shadow`, or `/etc/ssh/sshd_config` | High | Verify whether the modification was authorized |

## Incident Investigation

The dashboard provides an investigation view containing:

- Severity
- Detection type
- Source IP or user
- Incident status
- Failed authentication count
- Command or modified file
- Recommended response
- Timestamp


### Project Structure
mini-soc-lab/
├── dashboard/
├── incidents/
├── logs/
├── reports/
├── screenshots/
├── scripts/
├── api.py
├── .gitignore
└── README.md


## Technology Stack

- Python
- Flask
- React
- Vite
- Recharts
- JSON
- CSS


###How to Run
TERMINAL 1
cd mini-soc-lab
python3 api.py

TERMINAL 2
cd mini-soc-lab/dashboard
npm install
npm run dev

DETECTION ENGINE
python3 scripts/log_analyzer.py



## Example Investigation

A simulated source generated multiple failed SSH authentication attempts followed by a successful administrative login.

The detection engine correlated these events and generated a Critical alert.

The analyst can then investigate the source, review the authentication activity, and update the incident status from Open to Investigating and finally Resolved.


## Security Concepts Demonstrated

- Authentication monitoring
- Brute-force detection
- Event correlation
- Privilege monitoring
- File integrity monitoring concepts
- Alert triage
- Incident investigation
- Incident status management
- REST API development
- Security monitoring dashboards


## Scope and Limitations

This is a local simulated SOC lab, not a production SIEM.

Security events are intentionally generated as sample log data for defensive analysis. The project does not perform scanning, exploitation, or attacks against external systems.

The current detection engine uses rule-based detection and operates on the simulated log format.


## Future Improvements

- Time-window-based event correlation
- Additional authentication and network detections
- Detailed incident timelines
- Analyst notes
- API authentication and authorization
- Database-backed alert storage
- SIEM integration
- Automated security notifications


## Purpose

This project was built as a practical cybersecurity portfolio project to demonstrate hands-on understanding of SOC workflows, detection engineering, log analysis, incident triage, and security monitoring.
