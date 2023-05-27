from flask import Blueprint, jsonify, request, Response

from matchpredictor.forecast.forecaster import Forecaster
from matchpredictor.matchresults.result import Team, Fixture, Scenario


def forecast_api(forecaster: Forecaster) -> Blueprint:
    """
    Creates a Blueprint for the forecast API.

    Args:
        forecaster (Forecaster): The forecaster object used to generate forecasts.

    Returns:
        Blueprint: A Blueprint object representing the forecast API.
    """
    # Create a Blueprint for the forecast API
    api = Blueprint("forecast_api", __name__)

    @api.route("/forecast", methods=["GET"])
    def forecast() -> Response:
        """
        Handles GET requests to the "/forecast" endpoint.

        Returns:
            Response: The forecast result as a JSON response.
        """
        # Retrieve query parameters from the request
        home_name = request.args['home_name']
        away_name = request.args['away_name']
        league = request.args['league']
        model_name = request.args['model_name']

        # Call the forecaster to generate a forecast for the fixture
        result = forecaster.forecast(
            Fixture(
                home_team=Team(name=home_name),
                away_team=Team(name=away_name),
                league=league,
            ),
            model_name=model_name,
        )

        # Check if the forecast is available
        if result is None:
            return Response("Cannot forecast fixture", 400)

        # Return the forecast as JSON response
        return jsonify(result)

    @api.route("/forecast-in-progress", methods=["GET"])
    def forecast_in_progress() -> Response:
        """
        Handles GET requests to the "/forecast-in-progress" endpoint.

        Returns:
            Response: The forecast result for an in-progress fixture as a JSON response.
        """
        # Retrieve query parameters from the request
        home_name = request.args['home_name']
        away_name = request.args['away_name']
        league = request.args['league']
        model_name = request.args['model_name']
        minutes_elapsed = request.args.get('minutes_elapsed', default=0, type=int)
        home_goals = request.args.get('home_goals', default=0, type=int)
        away_goals = request.args.get('away_goals', default=0, type=int)

        # Call the forecaster to generate a forecast for the in-progress fixture
        result = forecaster.forecast_in_progress(
            Fixture(
                home_team=Team(name=home_name),
                away_team=Team(name=away_name),
                league=league,
            ),
            Scenario(
                minutes_elapsed=minutes_elapsed,
                home_goals=home_goals,
                away_goals=away_goals,
            ),
            model_name=model_name,
        )

        # Check if the forecast is available
        if result is None:
            return Response("Cannot forecast fixture", 400)

        # Return the forecast as JSON response
        return jsonify(result)

    return api
