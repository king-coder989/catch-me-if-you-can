
# Door of Illusions Game

## Upload Instructions for Background and Avatar Images

### Background Images
Upload background images to: `/public/images/backgrounds/`

Naming convention:
- `stage1.jpg` - Background for Stage 1
- `stage2.jpg` - Background for Stage 2
- ...
- `stage15.jpg` - Background for Stage 15

Recommended properties:
- Resolution: At least 1920x1080px
- Format: JPG or WEBP (for better compression)
- Theme should match the intensity and psychological aspects of each stage:
  - Stages 1-3: Lighter, less threatening environments
  - Stages 4-6: Moderate intensity, slightly unsettling
  - Stages 7-9: Dark, more ominous environments
  - Stages 10-15: Very dark, psychologically disturbing environments

### Avatar Images
Upload avatar images to: `/public/images/avatars/`

Naming convention:
- `{personality}_{stage}.png`

For example:
- `trickster_early.png` - Trickster personality in early game stages (1-3)
- `manipulator_middle.png` - Manipulator personality in middle game stages (4-6)
- `psycho_late.png` - Psycho personality in late game stages (7-9)
- `psycho_final.png` - Psycho personality in final game stages (10-15)

Recommended properties:
- Square dimensions (e.g., 256x256)
- PNG format with transparency support
- Clear facial features visible within the circle crop

If these images are not provided, the system will fall back to initials in the avatar.
