from flask import Blueprint, jsonify, Response


def health_api() -> Blueprint:
    """
    Creates a Blueprint for the health API.

    Returns:
        Blueprint: The health API Blueprint.
    """
    # Create a Blueprint for the health API
    api = Blueprint("health_api", __name__)

    # Handle GET requests to the "/" endpoint
    @api.route("/", methods=["GET"])
    def health() -> Response:
        """
        Handles GET requests to the "/" endpoint.

        Returns:
            Response: The JSON response indicating the status is "UP".
        """
        # Return a JSON response indicating the status is "UP"
        return jsonify({"status": "UP"})

    # Return the health API Blueprint
    return api
