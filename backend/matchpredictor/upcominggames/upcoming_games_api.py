from dataclasses import dataclass
from typing import List

from flask import Blueprint, Response, jsonify

from matchpredictor.upcominggames.football_data_api_client import FootballDataApiClient, FootballDataMatchesResponse, \
    MatchJson


@dataclass(frozen=True)
class Team:
    name: str
    leagues: List[str]


@dataclass(frozen=True)
class UpcomingGame:
    home: Team
    away: Team


@dataclass(frozen=True)
class UpcomingGamesResponse:
    games: List[UpcomingGame]


# Converts FootballDataMatchesResponse to UpcomingGamesResponse
def response_from_football_data_matches(matches_response: FootballDataMatchesResponse) -> UpcomingGamesResponse:
    # Builds an UpcomingGame object from MatchJson
    def build_upcoming_game(match_json: MatchJson) -> UpcomingGame:
        return UpcomingGame(
            home=Team(name=match_json.homeTeam.name, leagues=[match_json.competition.name]),
            away=Team(name=match_json.awayTeam.name, leagues=[match_json.competition.name]),
        )

    # Builds a list of UpcomingGame objects by applying build_upcoming_game to each match in matches_response
    games = [
        build_upcoming_game(m) for m in matches_response.matches
    ]

    # Creates an UpcomingGamesResponse object with the list of games
    return UpcomingGamesResponse(games)


def upcoming_games_api(api_client: FootballDataApiClient) -> Blueprint:
    # Creates a Blueprint for the upcoming games API
    api = Blueprint("upcoming_games_api", __name__)

    # Handles GET requests to the "/upcoming-games" endpoint
    @api.route('/upcoming-games', methods=["GET"])
    def list_upcoming_games() -> Response:
        # Fetches matches from the FootballDataApiClient
        maybe_football_data_api_matches = api_client.fetch_matches()

        # Checks if matches were successfully fetched
        if maybe_football_data_api_matches is None:
            return Response("Oops", 503)

        matches = maybe_football_data_api_matches
        # Converts matches to UpcomingGamesResponse
        upcoming_games_response = response_from_football_data_matches(matches)

        # Returns the upcoming games response as JSON
        return jsonify(upcoming_games_response)

    # Returns the upcoming games API Blueprint
    return api
