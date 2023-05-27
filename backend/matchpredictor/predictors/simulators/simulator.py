from random import random
from typing import TypeAlias, Callable

from matchpredictor.matchresults.result import Fixture, Outcome, Scenario
from matchpredictor.predictors.simulators.scoring_rates import ScoringRates

Simulator: TypeAlias = Callable[[Fixture, Scenario], Outcome]


# Create a simulator function that predicts match outcomes based on the offensive performance of teams.
def offense_simulator(scoring_rates: ScoringRates) -> Simulator:
    # Simulate a match outcome based on offensive performance.
    def simulate(fixture: Fixture, scenario: Scenario) -> Outcome:
        # Get the goal scoring rate for the home team from the scoring rates object.
        home_goal_rate = scoring_rates.goals_scored_per_minute(fixture.home_team)
        # Get the goal scoring rate for the away team from the scoring rates object.
        away_goal_rate = scoring_rates.goals_scored_per_minute(fixture.away_team)

        # Call a helper function to determine the match outcome based on goal scoring rates.
        return __outcome_from_goal_rate(home_goal_rate, away_goal_rate, scenario)

    return simulate


# Create a simulator function that predicts match outcomes based on both offensive and defensive performance of teams.
def offense_and_defense_simulator(scoring_rates: ScoringRates) -> Simulator:
    # Simulate a match outcome based on both offensive and defensive performance.
    def simulate(fixture: Fixture, scenario: Scenario) -> Outcome:
        # Get the goal scoring rate for the home team from the scoring rates object.
        home_goal_rate = scoring_rates.goals_scored_per_minute(fixture.home_team)
        # Get the defensive factor for the home team from the scoring rates object.
        home_defensive_factor = scoring_rates.defensive_factor(fixture.home_team)

        # Get the goal scoring rate for the away team from the scoring rates object.
        away_goal_rate = scoring_rates.goals_scored_per_minute(fixture.away_team)
        # Get the defensive factor for the away team from the scoring rates object.
        away_defensive_factor = scoring_rates.defensive_factor(fixture.away_team)

        # Call a helper function to determine the match outcome based on adjusted goal scoring rates.
        return __outcome_from_goal_rate(
            home_goal_rate * away_defensive_factor,
            away_goal_rate * home_defensive_factor,
            scenario
        )

    return simulate


# Generate a match outcome based on goal scoring rates.
def __outcome_from_goal_rate(
        home_goal_rate: float,
        away_goal_rate: float,
        scenario: Scenario,
) -> Outcome:
    # Initialize the home team's score based on the current scenario.
    home_score = scenario.home_goals
    # Initialize the away team's score based on the current scenario.
    away_score = scenario.away_goals

    # Simulate the remaining minutes of the match.
    for _ in range(90 - scenario.minutes_elapsed):
        # Determine if the home team scores a goal based on the home goal rate.
        if random() <= home_goal_rate:
            home_score += 1
        # Determine if the away team scores a goal based on the away goal rate.
        if random() <= away_goal_rate:
            away_score += 1

    # Compare the final scores to determine the match outcome.
    if home_score > away_score:
        return Outcome.HOME
    elif away_score > home_score:
        return Outcome.AWAY
    else:
        return Outcome.DRAW
