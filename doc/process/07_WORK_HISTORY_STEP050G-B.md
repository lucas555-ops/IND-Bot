# 07_WORK_HISTORY_STEP050G-B

- Step: STEP050G-B
- Scope: unified workflow gallery + single-asset screen system; narrow front-end-only landing pass
- Changes:
  - replaced the old multi-layer `See the workflow` explainer with one cleaner gallery system: large active stage + short active copy + five thumbs
  - wired the new gallery to one asset per step so the same scene now serves both mini preview and expanded stage without separate mini/open images
  - added five optimized workflow assets under `assets/workflow/` and switched the landing to WEBP for lighter delivery
  - added lightweight client-side thumb switching so the active stage updates image, label, title, and description without changing the rest of the landing order
  - aligned landing smoke and docs canon to the STEP050G-B workflow-gallery contract
- Checks:
  - npm run check
  - npm run smoke:landing
  - npm run smoke:legal
  - npm run smoke:landing-polish
- Status: source-clean; live status not confirmed — manual verification required
