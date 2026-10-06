from flask import Flask, jsonify, request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

ALERT_FILE = "reports/alerts.json"


@app.route("/api/alerts", methods=["GET"])
def get_alerts():
    try:
        with open(ALERT_FILE, "r") as file:
            alerts = json.load(file)

        return jsonify(alerts)

    except Exception as error:
        return jsonify({"error": str(error)}), 500


@app.route("/api/alerts/<int:alert_id>/status", methods=["PUT"])
def update_status(alert_id):
    try:
        with open(ALERT_FILE, "r") as file:
            alerts = json.load(file)

        if alert_id < 0 or alert_id >= len(alerts):
            return jsonify({"error": "Alert not found"}), 404

        data = request.get_json()
        new_status = data.get("status")

        allowed_statuses = [
            "Open",
            "Investigating",
            "Resolved"
        ]

        if new_status not in allowed_statuses:
            return jsonify({"error": "Invalid status"}), 400

        alerts[alert_id]["status"] = new_status

        with open(ALERT_FILE, "w") as file:
            json.dump(alerts, file, indent=4)

        return jsonify(alerts[alert_id])

    except Exception as error:
        return jsonify({"error": str(error)}), 500


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "service": "Mini SOC API"
    })


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )