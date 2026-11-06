from pathlib import Path


def delete_image(image_path: str | Path | None) -> None:
    """Delete a previously saved image, if it exists."""
    if image_path is None:
        return

    try:
        Path(image_path).unlink(missing_ok=True)
    except OSError:
        # Keep cleanup failures from hiding the original report error.
        pass
