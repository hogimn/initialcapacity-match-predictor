from dataclasses import dataclass
from typing import Dict, Optional, List

from matchpredictor.predictors.predictor import Predictor, InProgressPredictor


@dataclass(frozen=True)
class Model(object):
    """
    Represents a model with a name and a predictor.

    Attributes:
        name (str): The name of the model.
        predictor (Predictor | InProgressPredictor): The predictor associated with the model.
    """

    name: str
    predictor: Predictor | InProgressPredictor

    def predicts_in_progress(self) -> bool:
        """
        Checks if the model's predictor is an InProgressPredictor.

        Returns:
            bool: True if the predictor is an InProgressPredictor, False otherwise.
        """
        return isinstance(self.predictor, InProgressPredictor)


class ModelProvider(object):
    """
    Provides access to models and their predictors.

    Attributes:
        __models (Dict[str, Model]): A dictionary that maps model names to Model objects.
    """

    def __init__(self, models: List[Model]) -> None:
        """
        Initializes the ModelProvider with a list of models.

        Args:
            models (List[Model]): The list of models to populate the provider with.
        """
        self.__models: Dict[str, Model] = {}
        for model in models:
            self.__models[model.name] = model

    def get_predictor(self, model_name: str) -> Optional[Predictor]:
        """
        Retrieves the predictor for the specified model name.

        Args:
            model_name (str): The name of the model.

        Returns:
            Optional[Predictor]: The predictor associated with the model, or None if the model does not exist.
        """
        model = self.__models.get(model_name)

        # If the model does not exist, return None.
        if model is None:
            return None

        # Return the predictor associated with the model.
        return model.predictor

    def get_in_progress_predictor(self, model_name: str) -> Optional[InProgressPredictor]:
        """
        Retrieves the in-progress predictor for the specified model name.

        Args:
            model_name (str): The name of the model.

        Returns:
            Optional[InProgressPredictor]: The in-progress predictor associated with the model,
            or None if the model does not exist or its predictor is not an InProgressPredictor.
        """
        model = self.__models.get(model_name)

        # If the model does not exist or its predictor is not an InProgressPredictor, return None.
        if model is None or not isinstance(model.predictor, InProgressPredictor):
            return None

        # Return the in-progress predictor associated with the model.
        return model.predictor

    def list(self) -> List[Model]:
        """
        Returns a list of all models stored in the provider.

        Returns:
            List[Model]: The list of models.
        """
        return list(self.__models.values())
