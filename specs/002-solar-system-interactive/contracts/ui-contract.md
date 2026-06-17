# UI Contract: Solar System Interactive

**Date**: 2026-06-17
**Feature**: Solar System Interactive
**Branch**: 002-solar-system-interactive

## Overview

This document defines the user interface contract for the solar system feature - the visual elements, interactions, and behaviors that users can expect.

## Visual Elements

### Rope Element

| Property | Value |
|----------|-------|
| Position | Top center of viewport |
| Width | 40px |
| Height | 80px (visible portion) |
| Color | Purple gradient (#6b4ee6 to #2d1b69) |
| Border radius | 20px (rounded bottom) |
| Shadow | 0 0 20px rgba(107, 78, 230, 0.5) |
| Cursor | grab (default), grabbing (while dragging) |
| Z-index | 100 (above solar system) |

### Solar System Container

| Property | Value |
|----------|-------|
| Position | Full viewport, centered |
| Background | Transparent (starfield shows through) |
| Transition | transform 0.5s ease-out |

### Sun

| Property | Value |
|----------|-------|
| Position | Center of solar system |
| Size | 100px diameter |
| Color | Radial gradient (#fff7ad, #ffa500, #ff4500) |
| Animation | Glow pulse 3s ease-in-out infinite |

### Planets

| Property | Value |
|----------|-------|
| Position | Orbiting sun at defined radii |
| Size | 10-50px diameter (varies by planet) |
| Color | Planet-specific (see data model) |
| Animation | Orbital rotation (speed varies by planet) |
| Hover | Glow effect + scale(1.1) |
| Cursor | pointer |

### Parameter Panel

| Property | Value |
|----------|-------|
| Position | Fixed, center-right (desktop) / full-width bottom (mobile) |
| Width | 300px (desktop) / 100% (mobile) |
| Background | rgba(0, 0, 0, 0.9) with blur |
| Border | 1px solid rgba(107, 78, 230, 0.5) |
| Border radius | 12px |
| Padding | 24px |
| Z-index | 200 (above solar system) |

## Interactions

### Rope Pull

| Input | Response |
|-------|----------|
| mousedown/touchstart on rope | Begin tracking drag |
| mousemove/touchmove | Update reveal progress (0-1) based on distance |
| mouseup/touchend | If progress > 0.3: lock visible; else: snap back |
| Click on rope (no drag) | Toggle visibility |

### Planet Click

| Input | Response |
|-------|----------|
| click/tap on planet | Open parameter panel for that planet |
| click/tap on different planet | Update panel to show new planet |
| click/tap outside panel | Close parameter panel |
| click/tap close button | Close parameter panel |

### Collapse

| Input | Response |
|-------|----------|
| Pull rope upward | Begin hiding animation |
| Click collapse button | Immediately hide solar system |
| Escape key | Close parameter panel if open |

## Animation Specifications

### Reveal Animation

```
Duration: 0.5s ease-out
Property: transform: translateY()
From: translateY(-100%) (hidden above viewport)
To: translateY(0) (fully visible)
```

### Planet Orbit

```
Duration: varies by planet (88-365 days relative)
Property: transform: rotate() translateX()
Center: Sun position
```

### Parameter Panel

```
Show: opacity 0→1, translateY(20px→0) in 0.3s ease-out
Hide: opacity 1→0, translateY(0→20px) in 0.2s ease-in
```

## Responsive Breakpoints

| Breakpoint | Rope Size | Planet Sizes | Panel Position |
|------------|-----------|--------------|----------------|
| <768px | 30x60px | 8-30px | Full-width bottom |
| 768-1024px | 35x70px | 10-40px | Right side |
| >1024px | 40x80px | 12-50px | Right side |
