from dataclasses import dataclass

from flask import Blueprint, jsonify, Response

from matchpredictor.model.model_provider import ModelProvider


@dataclass(frozen=True)
class ModelInfo(object):
    """
    Represents information about a model.

    Attributes:
        name (str): The name of the model.
        predicts_in_progress (bool): Indicates whether the model predicts in-progress fixtures.
    """
    name: str
    predicts_in_progress: bool


def models_api(model_provider: ModelProvider) -> Blueprint:
    """
    Creates a Blueprint for the models API.

    Args:
        model_provider (ModelProvider): The ModelProvider that provides access to the models.

    Returns:
        Blueprint: The Blueprint for the models API.
    """
    api = Blueprint("models_api", __name__)

    @api.route("/models", methods=["GET"])
    def models() -> Response:
        """
        Retrieves information about all models from the ModelProvider.

        Returns:
            Response: The JSON response containing information about all models.
        """
        # Retrieve information about all models from the ModelProvider
        return jsonify({
            "models": [ModelInfo(model.name, model.predicts_in_progress()) for model in model_provider.list()]
        })

    # Returns the models API Blueprint
    return api
