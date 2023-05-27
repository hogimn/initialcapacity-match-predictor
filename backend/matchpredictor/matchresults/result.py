from dataclasses import dataclass
from enum import Enum


@dataclass(frozen=True)
class Team(object):
    """
    Dataclass to represent a team.

    Attributes:
        name (str): The name of the team.
    """
    name: str


@dataclass(frozen=True)
class Fixture(object):
    """
    Dataclass to represent a fixture.

    Attributes:
        home_team (Team): The home team.
        away_team (Team): The away team.
        league (str): The league of the fixture.
    """
    home_team: Team
    away_team: Team
    league: str


@dataclass(frozen=True)
class Scenario(object):
    """
    Dataclass to represent a scenario of a fixture in progress.

    Attributes:
        minutes_elapsed (int): The minutes elapsed in the fixture.
        home_goals (int): The number of goals scored by the home team.
        away_goals (int): The number of goals scored by the away team.
    """
    minutes_elapsed: int
    home_goals: int
    away_goals: int


class Outcome(str, Enum):
    """
    Enumeration class for representing the possible outcomes of a fixture.

    Values:
        HOME: The home team wins.
        AWAY: The away team wins.
        DRAW: The fixture ends in a draw.
    """
    HOME = "home"
    AWAY = "away"
    DRAW = "draw"


@dataclass
class Result(object):
    """
    Dataclass to represent the result of a fixture.

    Attributes:
        fixture (Fixture): The fixture for which the result is recorded.
        outcome (Outcome): The outcome of the fixture.
        home_goals (int): The number of goals scored by the home team.
        away_goals (int): The number of goals scored by the away team.
        season (int): The season of the fixture.
    """
    fixture: Fixture
    outcome: Outcome
    home_goals: int
    away_goals: int
    season: int
