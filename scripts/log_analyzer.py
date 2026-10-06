import re
import json
from collections import Counter, defaultdict
from datetime import datetime

LOG_FILE = "logs/auth.log"
ALERT_FILE = "reports/alerts.json"

failed_attempts = Counter()
failed_users = defaultdict(list)
successful_logins = defaultdict(list)

with open(LOG_FILE, "r") as file:
    for line in file:

        # Detect failed authentication
        if "Failed password" in line:
            ip_match = re.search(r"from (\d+\.\d+\.\d+\.\d+)", line)
            user_match = re.search(r"(?:for|for invalid user) (\w+)", line)

            if ip_match:
                ip = ip_match.group(1)
                failed_attempts[ip] += 1

                if user_match:
                    user = user_match.group(1)
                    failed_users[ip].append(user)

        # Detect successful authentication
        if "Accepted password" in line:
            ip_match = re.search(r"from (\d+\.\d+\.\d+\.\d+)", line)
            user_match = re.search(r"for (\w+)", line)

            if ip_match and user_match:
                ip = ip_match.group(1)
                user = user_match.group(1)
                successful_logins[ip].append(user)


alerts = []

# Rule 3 — Suspicious privilege escalation

for line in open(LOG_FILE, "r"):

    if "sudo:" in line and "USER=root" in line:

        user_match = re.search(r"sudo: (\w+)", line)
        command_match = re.search(r"COMMAND=(.*)", line)

        user = user_match.group(1) if user_match else "Unknown"
        command = command_match.group(1) if command_match else "Unknown"

        alert = {
            "timestamp": datetime.now().isoformat(),
            "severity": "HIGH",
            "source_user": user,
            "event": "Privileged command executed using sudo",
            "command": command,
            "recommended_action": "Verify whether privileged activity was authorized",
            "status": "Open"
        }

        alerts.append(alert)

        print("\n🚨 HIGH SEVERITY")
        print(f"User: {user}")
        print(f"Command: {command}")
        print("Detection: Privileged command execution")
# Rule 4 — Sensitive file modification

for line in open(LOG_FILE, "r"):

    if "audit:" in line and "ACTION=MODIFY" in line:

        user_match = re.search(r"USER=(\w+)", line)
        file_match = re.search(r"FILE=(\S+)", line)

        user = user_match.group(1) if user_match else "Unknown"
        modified_file = file_match.group(1) if file_match else "Unknown"

        sensitive_files = [
            "/etc/passwd",
            "/etc/shadow",
            "/etc/ssh/sshd_config"
        ]

        if modified_file in sensitive_files:

            alert = {
                "timestamp": datetime.now().isoformat(),
                "severity": "HIGH",
                "source_user": user,
                "event": "Sensitive system file modified",
                "file": modified_file,
                "recommended_action": "Verify whether the modification was authorized",
                "status": "Open"
            }

            alerts.append(alert)

            print("\n🚨 HIGH SEVERITY")
            print(f"User: {user}")
            print(f"Modified file: {modified_file}")
            print("Detection: Sensitive system file modification")
# Rule 1 — Brute force
for ip, count in failed_attempts.items():

    if count >= 5:
        alert = {
            "timestamp": datetime.now().isoformat(),
            "severity": "HIGH",
            "source_ip": ip,
            "event": "Possible SSH brute-force attack",
            "failed_attempts": count,
            "recommended_action": "Investigate source IP and affected account",
            "status": "Open"
        }

        alerts.append(alert)

        print("\n🚨 HIGH SEVERITY")
        print(f"Source IP: {ip}")
        print(f"Failed attempts: {count}")
        print("Detection: Possible brute-force attack")

    elif count >= 3:
        alert = {
            "timestamp": datetime.now().isoformat(),
            "severity": "MEDIUM",
            "source_ip": ip,
            "event": "Repeated authentication failures",
            "failed_attempts": count,
            "recommended_action": "Monitor source IP",
            "status": "Open"
        }

        alerts.append(alert)

        print("\n⚠️ MEDIUM SEVERITY")
        print(f"Source IP: {ip}")
        print(f"Failed attempts: {count}")


# Rule 2 — Successful login after failures
for ip in successful_logins:

    if ip in failed_attempts and failed_attempts[ip] >= 3:

        alert = {
            "timestamp": datetime.now().isoformat(),
            "severity": "CRITICAL",
            "source_ip": ip,
            "event": "Successful login after repeated failures",
            "failed_attempts": failed_attempts[ip],
            "recommended_action": "Investigate account activity and source IP",
            "status": "Open"
        }

        alerts.append(alert)

        print("\n🚨🚨 CRITICAL ALERT")
        print(f"Source IP: {ip}")
        print(f"Failed attempts before success: {failed_attempts[ip]}")
        print("Detection: Successful login after repeated failures")


# Save alerts to JSON
with open(ALERT_FILE, "w") as file:
    json.dump(alerts, file, indent=4)


print("\n======================================")
print(f"Generated {len(alerts)} security alert(s)")
print(f"Saved to: {ALERT_FILE}")
print("======================================")
