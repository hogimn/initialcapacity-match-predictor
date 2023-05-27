import time
from typing import Iterable, Tuple

from matchpredictor.matchresults.result import Result
from matchpredictor.predictors.predictor import Predictor


class Evaluator(object):
    """
    Evaluator class to measure the accuracy of a predictor.
    """

    def __init__(self, predictor: Predictor) -> None:
        """
        Initializes the Evaluator with a Predictor.

        Args:
            predictor (Predictor): The predictor to be evaluated.
        """
        self.predictor = predictor

    def measure_accuracy(self, validation_data: Iterable[Result]) -> Tuple[float, float]:
        """
        Measures the accuracy of the predictor on the provided validation data.

        Args:
            validation_data (Iterable[Result]): Iterable collection of Result objects representing the validation data.

        Returns:
            Tuple[float, float]: A tuple containing the accuracy and the time elapsed.
        """
        results = list(validation_data)

        start_time = time.time()
        # Count the number of correct predictions
        correct_predictions = sum([self.__is_correct(m) for m in results])
        time_elapsed = time.time() - start_time

        # Return the accuracy and time elapsed
        return correct_predictions / len(results), time_elapsed

    def __is_correct(self, result: Result) -> bool:
        """
        Helper method to check if a prediction is correct.

        Args:
            result (Result): The result to evaluate.

        Returns:
            bool: True if the prediction is correct, False otherwise.
        """
        prediction = self.predictor.predict(result.fixture)
        return prediction.outcome == result.outcome
