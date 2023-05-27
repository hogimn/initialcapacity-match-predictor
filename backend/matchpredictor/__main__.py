import os

from matchpredictor.app import create_app, AppEnvironment


def require_env(name: str) -> str:
    """
    Retrieves the value of the specified environment variable.

    Args:
        name (str): The name of the environment variable.

    Returns:
        str: The value of the environment variable.

    Raises:
        Exception: If the environment variable is not set.
    """
    value = os.environ.get(name)
    if value is None:
        raise Exception(f"Failed to read {name} from the environment")
    return value


# Get the value of the 'PORT' environment variable, defaulting to 5001 if not set
port = os.environ.get('PORT', 5001)

# Create an instance of AppEnvironment with the necessary configuration
app_environment = AppEnvironment(
    csv_location=os.environ.get('CSV_LOCATION', 'https://projects.fivethirtyeight.com/soccer-api/club/spi_matches.csv'),
    season=2023,
    football_data_api_key=require_env('FOOTBALL_DATA_API_KEY'),
)

# Create the Flask app using the create_app function with the provided app_environment
create_app(app_environment).run(debug=True, host="0.0.0.0", port=int(port))
