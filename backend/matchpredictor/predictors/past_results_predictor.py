from typing import Iterable, Dict

from matchpredictor.matchresults.result import Outcome, Fixture, Result, Team
from matchpredictor.predictors.predictor import Predictor, Prediction


class PointsTable:
    def __init__(self) -> None:
        """
        Initializes an empty points table.
        """
        self.points_dict: Dict[str, int] = {}

    def points_for(self, team: Team) -> int:
        """
        Retrieves the points for a specific team.

        Args:
            team (Team): The team for which to retrieve the points.

        Returns:
            int: The points of the specified team.
        """
        return self.points_dict.get(team.name, 0)

    def record_win(self, team: Team) -> None:
        """
        Records a win for a specific team and adds 3 points to their total.

        Args:
            team (Team): The team that won the match.
        """
        self.__add_points(team, 3)

    def record_draw(self, team: Team) -> None:
        """
        Records a draw for a specific team and adds 1 point to their total.

        Args:
            team (Team): The team that played a draw.
        """
        self.__add_points(team, 1)

    def __add_points(self, team: Team, points: int) -> None:
        """
        Adds points to the total points of a specific team.

        Args:
            team (Team): The team for which to add points.
            points (int): The number of points to add.
        """
        # Retrieve the previous points for the team
        previous_points = self.points_dict.get(team.name, 0)
        # Add the new points to the team's total
        self.points_dict[team.name] = previous_points + points


class PastResultsPredictor(Predictor):
    def __init__(self, table: PointsTable) -> None:
        """
        Initializes the PastResultsPredictor with a PointsTable object.

        Args:
            table (PointsTable): The PointsTable object to use for prediction.
        """
        self.table = table

    def predict(self, fixture: Fixture) -> Prediction:
        """
        Predicts the outcome of a fixture based on past results.

        Args:
            fixture (Fixture): The fixture for which to make a prediction.

        Returns:
            Prediction: The predicted outcome of the fixture.
        """
        # Get points for home team
        home_points = self.table.points_for(fixture.home_team)
        # Get points for away team
        away_points = self.table.points_for(fixture.away_team)

        if home_points > away_points:
            # Predict home team win
            return Prediction(Outcome.HOME)
        elif home_points < away_points:
            # Predict away team win
            return Prediction(Outcome.AWAY)
        else:
            # Predict draw
            return Prediction(Outcome.DRAW)


def calculate_table(results: Iterable[Result]) -> PointsTable:
    """
    Calculates the points table based on the results.

    Args:
        results (Iterable[Result]): The iterable of Result objects.

    Returns:
        PointsTable: The PointsTable object representing the team standings.
    """
    # Create a PointsTable object to track team points
    table = PointsTable()

    for result in results:
        if result.outcome == Outcome.HOME:
            # Record a win for the home team
            table.record_win(result.fixture.home_team)
        elif result.outcome == Outcome.AWAY:
            # Record a win for the away team
            table.record_win(result.fixture.away_team)
        else:
            # Record a draw for the home team
            table.record_draw(result.fixture.home_team)
            # Record a draw for the away team
            table.record_draw(result.fixture.away_team)

    # Return the final PointsTable object
    return table


def train_results_predictor(results: Iterable[Result]) -> Predictor:
    """
    Trains a results predictor based on the past results.

    Args:
        results (Iterable[Result]): The iterable of Result objects.

    Returns:
        Predictor: The trained Predictor object.
    """
    # Create a predictor using the calculated points table
    return PastResultsPredictor(calculate_table(results))

