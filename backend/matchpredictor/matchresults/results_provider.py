import csv
from typing import Dict, Callable, List, Optional, cast

import requests

from matchpredictor.matchresults.result import Result, Fixture, Team, Outcome


def training_results(
        csv_location: str,
        year: int,
        result_filter: Callable[[Result], bool] = lambda result: True,
) -> List[Result]:
    """
    Retrieves the training results from a CSV file.

    Args:
        csv_location (str): The location of the CSV file.
        year (int): The specific year to filter the results.
        result_filter (Callable[[Result], bool], optional):
            Optional result filter function. Defaults to lambda result: True.

    Returns:
        List[Result]: The filtered training results.
    """
    # Call the load_results function with a result filter that checks for results before the given year.
    return load_results(csv_location, lambda r: result_filter(r) and r.season < year)


def validation_results(
        csv_location: str,
        year: int,
        result_filter: Callable[[Result], bool] = lambda result: True
) -> List[Result]:
    """
    Retrieves the training results from a CSV file.

    Args:
        csv_location (str): The location of the CSV file.
        year (int): The specific year to filter the results.
        result_filter (Callable[[Result], bool], optional):
            Optional result filter function. Defaults to lambda result: True.

    Returns:
        List[Result]: The filtered training results.
    """
    # Call the load_results function with a result filter that checks for results in the given year.
    return load_results(csv_location, lambda r: result_filter(r) and r.season == year)


def load_results(
        csv_location: str,
        result_filter: Callable[[Result], bool] = lambda result: True,
) -> List[Result]:
    """
    Loads the results from a CSV file.

    Args:
        csv_location (str): The location of the CSV file.
        result_filter (Callable[[Result], bool], optional):
            Optional result filter function. Defaults to lambda result: True.

    Returns:
        List[Result]: The filtered results.
    """

    def match_outcome(home_goals: int, away_goals: int) -> Outcome:
        """
        Determines the outcome of a match based on the number of home and away goals.

        Args:
            home_goals (int): The number of goals scored by the home team.
            away_goals (int): The number of goals scored by the away team.

        Returns:
            Outcome: The outcome of the match.
        """
        if home_goals > away_goals:
            return Outcome.HOME
        if away_goals > home_goals:
            return Outcome.AWAY
        return Outcome.DRAW

    def result_from_row(row: Dict[str, str]) -> Optional[Result]:
        """
        Converts a row from the CSV file to a Result object.

        Args:
            row (Dict[str, str]): A dictionary representing a row of data from the CSV file.

        Returns:
            Optional[Result]: The Result object created from the row, or None if the row is invalid.
        """
        try:
            # Extract the home_goals and away_goals from the row dictionary and convert them to integers.
            home_goals = int(row['score1'])
            away_goals = int(row['score2'])

            # Create a Result object using the extracted data and return it.
            return Result(
                fixture=Fixture(
                    home_team=Team(row['team1']),
                    away_team=Team(row['team2']),
                    league=row['league']
                ),
                outcome=match_outcome(home_goals, away_goals),
                home_goals=home_goals,
                away_goals=away_goals,
                season=int(row['season'])
            )
        except (KeyError, ValueError):
            # If any required fields are missing or the goal values cannot be converted to integers, return None.
            return None

    # Send a GET request to the `csv_location` URL and retrieve the text content of the response,
    # which represents the CSV data.
    training_data = requests.get(csv_location).text

    # Split the `training_data` string into individual lines and create a `DictReader` object to parse the CSV data.
    rows = csv.DictReader(training_data.splitlines())
    # Filter the rows based on the given `result_filter` function and
    # map each row to a `Result` object using the `result_from_row` function.
    results = filter(lambda r: type(r) is Result and result_filter(r), map(result_from_row, rows))

    # Convert the filtered results to a list and cast it to `List[Result]` before returning.
    return cast(List[Result], list(results))
