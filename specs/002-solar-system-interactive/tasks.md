# Tasks: Solar System Interactive

**Input**: Design documents from `/specs/002-solar-system-interactive/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contract.md

**Tests**: Not explicitly requested in feature specification. Manual testing only.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the project structure and CSS/JS foundation

- [ ] T001 Add CSS custom properties for solar system theming in index.html
- [ ] T002 Create JavaScript data structure for planet data in index.html

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Add rope element HTML structure in index.html
- [ ] T004 Add solar system container HTML structure in index.html
- [ ] T005 Add planet parameter panel HTML structure in index.html
- [ ] T006 Add CSS for rope element styling in index.html
- [ ] T007 Add CSS for solar system container in index.html
- [ ] T008 Add CSS for planet parameter panel in index.html

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Pull Rope to Reveal Solar System (Priority: P1) 🎯 MVP

**Goal**: Users can pull the rope downward to reveal the solar system with smooth animation

**Independent Test**: Pull rope down >30% of viewport height → solar system appears. Release <30% → snaps back.

### Implementation for User Story 1

- [ ] T009 [US1] Add rope drag event handlers (mousedown/touchstart) in index.html
- [ ] T010 [US1] Add rope drag move handlers (mousemove/touchmove) in index.html
- [ ] T011 [US1] Add rope drag end handlers (mouseup/touchend) in index.html
- [ ] T012 [US1] Implement reveal progress calculation logic in index.html
- [ ] T013 [US1] Implement solar system visibility toggle logic in index.html
- [ ] T014 [US1] Add CSS transition for solar system reveal animation in index.html

**Checkpoint**: Rope pull reveals solar system. Users can pull down to see planets.

---

## Phase 4: User Story 2 - Click Planet to View Parameters (Priority: P1)

**Goal**: Users can click any planet to see its parameters in a panel

**Independent Test**: Click planet → parameter panel appears with correct data. Click outside → panel closes.

### Implementation for User Story 2

- [ ] T015 [P] [US2] Create 8 planet DOM elements with click handlers in index.html
- [ ] T016 [US2] Implement planet click event handler in index.html
- [ ] T017 [US2] Implement parameter panel content rendering in index.html
- [ ] T018 [US2] Implement panel close logic (click outside + close button) in index.html
- [ ] T019 [US2] Add CSS for planet hover effects in index.html

**Checkpoint**: Clicking planets shows parameter panel. Panel closes on outside click.

---

## Phase 5: User Story 3 - Solar System Animation and Visual Effects (Priority: P2)

**Goal**: Planets orbit the sun with smooth animation, sun has glow effect

**Independent Test**: Observe solar system for 30 seconds → planets orbit smoothly at different speeds.

### Implementation for User Story 3

- [ ] T020 [US3] Add sun element with glow animation in index.html
- [ ] T021 [US3] Implement planet orbital animation using requestAnimationFrame in index.html
- [ ] T022 [US3] Set different orbital speeds for each planet in index.html
- [ ] T023 [US3] Add CSS for sun glow/flicker effect in index.html

**Checkpoint**: Solar system animates with planets orbiting sun at realistic relative speeds.

---

## Phase 6: User Story 4 - Responsive Design (Priority: P2)

**Goal**: Feature works on mobile, tablet, and desktop with appropriate sizing

**Independent Test**: Test on 375px, 768px, and 1200px viewports → all work correctly.

### Implementation for User Story 4

- [ ] T024 [P] [US4] Add CSS media queries for mobile (<768px) in index.html
- [ ] T025 [P] [US4] Add CSS media queries for tablet (768-1024px) in index.html
- [ ] T026 [US4] Adjust planet sizes for mobile viewport in index.html
- [ ] T027 [US4] Adjust parameter panel layout for mobile in index.html
- [ ] T028 [US4] Add collapse button for hiding solar system in index.html

**Checkpoint**: Feature works on all device sizes with appropriate layouts.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and cleanup

- [ ] T029 Optimize animation performance for mobile devices in index.html
- [ ] T030 Add accessibility attributes (aria-labels, keyboard navigation) in index.html
- [ ] T031 Final code cleanup and comments in index.html
- [ ] T032 Test across browsers (Chrome, Firefox, Safari, Edge) manually

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 and US2 can proceed in parallel (P1 priorities)
  - US3 and US4 can proceed in parallel (P2 priorities)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Requires planets to exist (T015)
- **User Story 3 (P2)**: Can start after US1 (needs solar system visible)
- **User Story 4 (P2)**: Can start after US1 (needs solar system visible)

### Parallel Opportunities

- Phase 1 tasks can run in parallel
- Phase 2 tasks can run in parallel (different HTML sections)
- US1 and US2 can be developed in parallel after Phase 2
- US3 and US4 can be developed in parallel after US1

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (rope pull reveals solar system)
4. Complete Phase 4: User Story 2 (click planets to see parameters)
5. **STOP and VALIDATE**: Test MVP independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add US1 (rope pull) → Test independently → Deploy/Demo
3. Add US2 (planet parameters) → Test independently → Deploy/Demo (MVP!)
4. Add US3 (animations) → Test independently → Deploy/Demo
5. Add US4 (responsive) → Test independently → Deploy/Demo
6. Polish → Final deployment

---

## Notes

- All tasks modify the same file: `index.html`
- Tasks are ordered to minimize merge conflicts
- Each phase represents a testable increment
- Manual testing required (no automated tests requested)
- CSS and JavaScript are inline in index.html (matching existing project structure)
