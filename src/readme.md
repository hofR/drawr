# Assumptions

- Only one drawing mode can be active
- If selection is enabled, drawing is disabled, but drag may stay enabled
- If drawing mode is activated, selection and drag are disabled
- If drag is enabled, drawing is disabled, but selection may stay enabled

# Upcoming Features

- Multi Layer support
- Cut & Copy & Paste
- Public methods for retrieving shape information
  - e.g. all shapes on layer
- Toggle visibility of shapes
- handling of scale and rotate

# Design Decisions

- All operations that modify the internal state (e.g. deletion, copy) can only be performed by the API provided from the drawing-editor
