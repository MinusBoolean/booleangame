# Data Model: Solar System Interactive

**Date**: 2026-06-17
**Feature**: Solar System Interactive
**Branch**: 002-solar-system-interactive

## Entity Definitions

### Planet

Represents a celestial body in the solar system.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| name | String | Planet name | Required, non-empty |
| diameter | Number | Diameter in kilometers | Positive integer |
| distanceFromSun | Number | Distance from Sun in million km | Positive number |
| orbitalPeriod | Number | Orbital period in Earth days | Positive integer |
| moons | Number | Number of moons | Non-negative integer |
| temperature | String | Surface temperature description | Non-empty string |
| color | String | CSS color value for rendering | Valid CSS color |
| size | Number | Relative size for display (1-10) | Positive integer |
| orbitRadius | Number | Relative orbit distance for display | Positive integer |

### SolarSystemState

Represents the current state of the solar system interaction.

| Field | Type | Description | Values |
|-------|------|-------------|--------|
| isVisible | Boolean | Whether solar system is currently visible | true/false |
| revealProgress | Number | Current reveal progress (0-1) | 0.0 - 1.0 |
| selectedPlanet | String | Currently selected planet name | null or planet name |
| isAnimating | Boolean | Whether an animation is in progress | true/false |

### RopeState

Represents the state of the rope pull interaction.

| Field | Type | Description | Values |
|-------|------|-------------|--------|
| isDragging | Boolean | Whether user is currently dragging | true/false |
| startY | Number | Y position where drag started | pixel value |
| currentY | Number | Current Y position during drag | pixel value |
| pullDistance | Number | Total distance pulled in pixels | non-negative |

## State Transitions

### Solar System Visibility

```
HIDDEN → REVEALING → VISIBLE → HIDING → HIDDEN
  ↑          ↑           ↑         ↑
  │          │           │         └── User pulls rope up / clicks collapse
  │          │           └── Pull distance > 30% threshold
  │          └── User starts dragging rope
  └── Animation complete / user cancels
```

### Planet Selection

```
NO_SELECTION → SELECTED → NO_SELECTION
     ↑              ↑
     │              └── User clicks different planet
     └── User clicks planet / clicks outside panel
```

## Data Flow

1. User drags rope → RopeState updates → SolarSystemState.revealProgress updates
2. revealProgress > 0.3 → SolarSystemState.isVisible = true
3. User clicks planet → SolarSystemState.selectedPlanet updates → Parameter panel shows
4. User clicks outside → SolarSystemState.selectedPlanet = null → Parameter panel hides
