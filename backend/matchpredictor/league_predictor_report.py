from matchpredictor.app import build_model_provider
from matchpredictor.evaluation.reporter import Reporter
from matchpredictor.matchresults.result import Result
from matchpredictor.matchresults.results_provider import training_results, validation_results


def predictor_report_for(league: str, year: int) -> None:
    """
    Generates and prints a prediction report for a specific league and year.

    Args:
        league (str): The league name.
        year (int): The year.

    Returns:
        None
    """
    # Helper function to check if a result belongs to a specific league
    def matches_league(result: Result) -> bool:
        return result.fixture.league == league

    # Set the CSV location
    csv_location = 'https://projects.fivethirtyeight.com/soccer-api/club/spi_matches.csv'
    # Fetch training data using the training_results function
    training_data = training_results(csv_location, year,
                                     lambda result: result.season >= year - 3 and matches_league(result))
    # Fetch validation data using the validation_results function
    validation_data = validation_results(csv_location, year, matches_league)

    # Create a Reporter object with the league and year as the title, validation data,
    # and a model provider built from the training data
    # Generate and print the prediction report
    Reporter(f"{league} {year}", validation_data, build_model_provider(training_data)) \
        .run_report()
