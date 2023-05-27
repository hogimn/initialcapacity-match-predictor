from dataclasses import dataclass
from typing import Dict, Iterable

from matchpredictor.matchresults.result import Team, Result


# Define a data class to hold scoring statistics for a team
@dataclass
class TeamScoring(object):
    goal_scored: int
    goals_conceded: int
    matches: int

    # Calculate the average goals scored per minute by the team
    def goals_scored_per_minute(self) -> float:
        # Check if the team has not played any matches
        if self.matches == 0:
            # Return a default scoring rate of 1 goal per 90 minutes
            return 1 / 90

        # Calculate the average number of goals scored per minute
        # Divide the total goals scored by the team by the total minutes played in matches multiplied by the number of matches
        return self.goal_scored / 90 / self.matches

    # Calculate the average goals conceded per match by the team
    def goals_conceded_per_match(self) -> float:
        # Check if the team has not played any matches
        if self.matches == 0:
            # Return a default value of conceding 1 goal per match
            return 1

        # Calculate the average number of goals conceded per match
        # Divide the total goals conceded by the team by the number of matches played
        return self.goals_conceded / self.matches


# Class to calculate scoring rates based on match results
class ScoringRates:
    scoring_dict: Dict[Team, TeamScoring]
    total_goals: int
    total_matches: int

    def __init__(self, results: Iterable[Result]) -> None:
        self.scoring_dict = {}
        self.total_goals = 0
        self.total_matches = 0

        for result in results:
            self.__add_result(result)

    # Calculate the defensive factor for a given team.
    # The defensive factor is a relative measure of the team's defensive performance compared to the average
    # across all teams. It is calculated by dividing the team's average goals conceded per match by the average
    # goals conceded per match across all teams.
    def defensive_factor(self, team: Team) -> float:
        # Check if the team exists in the scoring dictionary
        if team not in self.scoring_dict.keys():
            return 1

        # Retrieve the team's scoring statistics
        team_scoring = self.scoring_dict.get(team, TeamScoring(0, 0, 0))
        # Calculate the average goals conceded per match across all teams
        goals_conceded_per_match = self.__global_goals_per_match() / 2

        # Calculate the defensive factor for the given team by dividing its average goals conceded per match
        # by the average goals conceded per match across all teams
        return team_scoring.goals_conceded_per_match() / goals_conceded_per_match



    def goals_scored_per_minute(self, team: Team) -> float:
        # Calculate the average goals scored per minute by a given team
        team_scoring = self.scoring_dict.get(team, TeamScoring(0, 0, 0))

        return team_scoring.goals_scored_per_minute()

    # Update the scoring statistics based on a single match result
    def __add_result(self, result: Result) -> None:
        # Retrieve the scoring information for the home team from the scoring dictionary,
        # or create a new TeamScoring instance with initial values if the team is not present.
        home_team_scoring = self.scoring_dict.get(result.fixture.home_team, TeamScoring(0, 0, 0))
        # Update the scoring information for the home team by adding the goals scored and conceded,
        # and incrementing the number of matches played.
        self.scoring_dict[result.fixture.home_team] = TeamScoring(
            goal_scored=home_team_scoring.goal_scored + result.home_goals,
            goals_conceded=home_team_scoring.goals_conceded + result.away_goals,
            matches=home_team_scoring.matches + 1,
        )

        # Retrieve the scoring information for the away team from the scoring dictionary,
        # or create a new TeamScoring instance with initial values if the team is not present.
        away_team_scoring = self.scoring_dict.get(result.fixture.away_team, TeamScoring(0, 0, 0))
        # Update the scoring information for the away team by adding the goals scored and conceded,
        # and incrementing the number of matches played.
        self.scoring_dict[result.fixture.away_team] = TeamScoring(
            goal_scored=away_team_scoring.goal_scored + result.away_goals,
            goals_conceded=away_team_scoring.goals_conceded + result.home_goals,
            matches=away_team_scoring.matches + 1,
        )

        # Update the total number of goals by adding the home and away goals from the current match.
        self.total_goals += (result.home_goals + result.away_goals)
        # Increment the total number of matches played.
        self.total_matches += 1

    # Calculate the average goals per match across all teams
    def __global_goals_per_match(self) -> float:
        return self.total_goals / self.total_matches
