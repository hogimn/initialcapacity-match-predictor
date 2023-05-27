from flask import Blueprint, jsonify, Response

from matchpredictor.teams.teams_provider import TeamsProvider


def teams_api(teams_provider: TeamsProvider) -> Blueprint:
    """
    Creates a Blueprint for the teams API.

    Args:
        teams_provider (TeamsProvider): The teams provider object.

    Returns:
        Blueprint: The teams API Blueprint.
    """
    api = Blueprint("teams_api", __name__)

    # Handles GET requests to the "/teams" endpoint
    @api.route("/teams", methods=["GET"])
    def teams() -> Response:
        # Retrieves all teams from the TeamsProvider
        return jsonify({
            "teams": teams_provider.all()
        })

    # Returns the teams API Blueprint
    return api
