from dataclasses import dataclass
from typing import Iterable, List

from matchpredictor.evaluation.evaluator import Evaluator
from matchpredictor.matchresults.result import Result
from matchpredictor.model.model_provider import Model, ModelProvider

@dataclass
class PredictionReport(object):
    """
    Dataclass to represent a prediction report.
    """

    label: str
    accuracy: float
    time_elapsed: float

class Reporter:
    """
    Reporter class to generate prediction reports.
    """

    def __init__(self, title: str, validation_data: Iterable[Result], model_provider: ModelProvider) -> None:
        """
        Initializes the Reporter with the title, validation data, and model provider.

        Args:
            title (str): The title of the report.
            validation_data (Iterable[Result]): Iterable collection of Result objects representing the validation data.
            model_provider (ModelProvider): The model provider for generating reports.
        """
        self.title = title
        self.validation_data = validation_data
        self.model_provider = model_provider
        self.reports: List[PredictionReport] = []

    def run_report(self) -> None:
        """
        Runs the report by generating reports for each model in the model provider and printing them.
        """
        # Generate reports for each model in the model provider
        reports = map(self.__calculate_accuracy, self.model_provider.list())
        # Print the reports
        self.__print_reports(reports)

    def __print_reports(self, reports: Iterable[PredictionReport]) -> None:
        """
        Prints the prediction reports.

        Args:
            reports (Iterable[PredictionReport]): Iterable collection of PredictionReport objects to be printed.
        """
        # Print the report header
        print()
        print("=" * (len(self.title) + 2))
        print(f" {self.title} ")
        print("=" * (len(self.title) + 2))
        print()

        # Print the table header
        print(" {:<30} | {:<8} | {:<10}".format("Predictor", "Accuracy", "Elapsed"))
        print("-" * 32 + "+" + "-" * 10 + "+" + "-" * 11)

        # Print each report row
        format_line = " {:<30} | {:<8.6f} | {:<8.6f}s"
        for r in reports:
            print(format_line.format(r.label, r.accuracy, r.time_elapsed))

        print()

    def __calculate_accuracy(self, model: Model) -> PredictionReport:
        """
        Calculates the accuracy and time elapsed for a model using the Evaluator.

        Args:
            model (Model): The model for which the accuracy is calculated.

        Returns:
            PredictionReport: A PredictionReport object containing the model's label, accuracy, and time elapsed.
        """
        # Calculate accuracy and time elapsed for a model using the Evaluator
        accuracy, time_elapsed = Evaluator(model.predictor).measure_accuracy(self.validation_data)

        # Create a PredictionReport object with the model's label, accuracy, and time elapsed
        return PredictionReport(
            label=model.name,
            accuracy=accuracy,
            time_elapsed=time_elapsed
        )
