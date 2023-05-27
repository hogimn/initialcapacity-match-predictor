from typing import Iterable

from matchpredictor.matchresults.result import Fixture, Outcome, Result, Scenario
from matchpredictor.predictors.predictor import Predictor, Prediction, InProgressPredictor
from matchpredictor.predictors.simulators.scoring_rates import ScoringRates
from matchpredictor.predictors.simulators.simulator import Simulator, offense_simulator, offense_and_defense_simulator


class SimulationPredictor(InProgressPredictor):
    """
    A predictor that uses simulation to predict the outcome of a fixture, both for in-progress and completed fixtures.
    """

    def __init__(self, simulator: Simulator, simulations: int) -> None:
        """
        Initializes the SimulationPredictor.

        Args:
            simulator (Simulator): The simulator object to use for running simulations.
            simulations (int): The number of simulations to run.
        """
        self.simulator = simulator
        self.simulations = simulations

    def predict(self, fixture: Fixture) -> Prediction:
        """
        Predicts the outcome of a completed fixture.

        Args:
            fixture (Fixture): The completed fixture to predict.

        Returns:
            Prediction: The predicted outcome.
        """
        return self.predict_in_progress(fixture, Scenario(0, 0, 0))

    def predict_in_progress(self, fixture: Fixture, scenario: Scenario) -> Prediction:
        """
        Predicts the outcome of an in-progress fixture based on a given scenario.

        Args:
            fixture (Fixture): The in-progress fixture to predict.
            scenario (Scenario): The scenario representing the current state of the fixture.

        Returns:
            Prediction: The predicted outcome.
        """
        # Run simulations using the provided simulator and scenario
        results = [self.simulator(fixture, scenario) for _ in range(self.simulations)]

        # Count the number of occurrences for each outcome (HOME, AWAY, DRAW) in the simulation results
        home_count = sum(map(lambda r: r is Outcome.HOME, results))
        away_count = sum(map(lambda r: r is Outcome.AWAY, results))
        draw_count = sum(map(lambda r: r is Outcome.DRAW, results))

        # Determine the predicted outcome based on the majority count and calculate the confidence
        if home_count > away_count and home_count > draw_count:
            return Prediction(outcome=Outcome.HOME, confidence=home_count / self.simulations)
        if away_count > draw_count:
            return Prediction(outcome=Outcome.AWAY, confidence=away_count / self.simulations)
        else:
            return Prediction(outcome=Outcome.DRAW, confidence=draw_count / self.simulations)


def train_offense_predictor(results: Iterable[Result], simulations: int) -> Predictor:
    """
    Trains a predictor using the offense simulator and the provided number of simulations.

    Args:
        results (Iterable[Result]): The past results to train the predictor.
        simulations (int): The number of simulations to run.

    Returns:
        Predictor: The trained predictor.
    """
    # Create a SimulationPredictor using the offense_simulator and provided number of simulations
    return SimulationPredictor(offense_simulator(ScoringRates(results)), simulations)


def train_offense_and_defense_predictor(results: Iterable[Result], simulations: int) -> Predictor:
    """
    Trains a predictor using the offense and defense simulator and the provided number of simulations.

    Args:
        results (Iterable[Result]): The past results to train the predictor.
        simulations (int): The number of simulations to run.

    Returns:
        Predictor: The trained predictor.
    """
    # Create a SimulationPredictor using the offense_and_defense_simulator and provided number of simulations
    return SimulationPredictor(offense_and_defense_simulator(ScoringRates(results)), simulations)
