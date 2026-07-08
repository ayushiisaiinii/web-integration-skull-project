_cache = {}

def get_predictor(model_name: str):
    if model_name in _cache:
        return _cache[model_name]

    if model_name == "cranial":
        from models.cranial.predictor import predict
    elif model_name == "maxilla":
        from models.maxilla.predictor import predict
    elif model_name == "mandible":
        from models.mandible.predictor import predict
    elif model_name == "mandible_classification":
        from models.mandible_classification.predictor import predict
    else:
        raise ValueError(f"Unknown model: {model_name}")

    _cache[model_name] = predict
    return predict