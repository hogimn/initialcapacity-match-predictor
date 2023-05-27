from dataclasses import dataclass
from typing import List, Dict, Set, Optional

from matchpredictor.matchresults.result import Fixture, Team


@dataclass(frozen=True)
class TeamWithLeagues(object):
    """
    Represents a team along with the leagues it participates in.

    Args:
        name (str): The name of the team.
        leagues (List[str]): The list of leagues the team participates in.
    """

    name: str
    leagues: List[str]


class TeamsProvider:
    """
    Provides information about teams and their respective leagues.
    """

    # Initializes the TeamsProvider with a list of fixtures.
    def __init__(self, fixtures: List[Fixture]) -> None:
        self.fixtures = fixtures

    # Retrieves information about all teams with their respective leagues.
    def all(self) -> List[TeamWithLeagues]:
        """
        Retrieves information about all teams with their respective leagues.

        Returns:
            A list of TeamWithLeagues objects representing all teams with their leagues.
        """
        # Dictionary to store teams and their leagues.
        teams: Dict[str, Set[str]] = {}

        # Helper function to add a team and its league to the teams dictionary.
        def add_team(team: Team, league: str) -> None:
            if team.name in teams:
                teams[team.name].add(league)
            else:
                teams[team.name] = {league}

        # Iterates over all fixtures to collect team and league information.
        for fixture in self.fixtures:
            add_team(fixture.home_team, fixture.league)
            add_team(fixture.away_team, fixture.league)

        # Returns a list of TeamWithLeagues objects representing all teams with their leagues.
        return [TeamWithLeagues(name=k, leagues=sorted(list(v))) for k, v in teams.items()]
