# UI Guide

## Chat Interface Overview

The G4F Chat application features a modern, clean chat interface inspired by popular AI assistants.

### Layout Structure

```
┌─────────────────────────────────────────────┐
│  🤖 G4F Chat - GPT-4O                      │  ← Header
├─────────────────────────────────────────────┤
│                                             │
│  [👤] You                                   │
│        ╭─────────────────────╮              │  ← User Message
│        │ Hello, how are you? │              │
│        ╰─────────────────────╯              │
│                                             │
│                    [🤖] Assistant           │
│              ╭─────────────────────╮        │  ← AI Response
│              │ I'm doing great!    │        │  (streaming)
│              │ How can I help?▊    │        │
│              ╰─────────────────────╯        │
│                                             │
│                                             │  ← Scrollable Area
├─────────────────────────────────────────────┤
│  [Type your message...]          [Send →]  │  ← Input Area
└─────────────────────────────────────────────┘
```

### Visual Elements

#### 1. Message Bubbles
- **User Messages** (right-aligned):
  - Green/primary color background
  - White text
  - Rounded corners with tail on top-right
  - User icon (👤) in green circle

- **Assistant Messages** (left-aligned):
  - Muted/gray background
  - Dark text
  - Rounded corners with tail on top-left
  - Bot icon (🤖) in gray circle

#### 2. Streaming States

**Initial State (Empty):**
```
    🤖 (large icon)

    Start a conversation
    Ask me anything! I'll respond in real-time.
```

**Loading State:**
```
[🤖] Assistant
  ╭───────────────────╮
  │ ⟳ Thinking...    │
  ╰───────────────────╯
```

**Streaming State:**
```
[🤖] Assistant
  ╭───────────────────╮
  │ Here is my resp▊  │  ← Pulsing cursor
  ╰───────────────────╯
```

**Complete State:**
```
[🤖] Assistant
  ╭───────────────────╮
  │ Here is my resp-  │
  │ onse to you!      │
  ╰───────────────────╯
```

#### 3. Input Area

**Active State:**
```
┌─────────────────────────────────────┬──────┐
│ Type your message...                │ [→]  │
└─────────────────────────────────────┴──────┘
```

**Loading State:**
```
┌─────────────────────────────────────┬──────┐
│ Type your message... (disabled)     │ [⟳]  │  ← Spinning
└─────────────────────────────────────┴──────┘
```

### Color Scheme

Based on the green theme specified in the original design:

- **Primary**: Green (#47A855 approx)
- **Background**: White / Dark gray
- **Muted**: Light gray (#F5F5F5)
- **Border**: Subtle gray

### Animations

1. **Cursor Pulse**: Blinking cursor during streaming (▊)
2. **Spinner**: Rotating loading indicator
3. **Auto-scroll**: Smooth scroll to latest message
4. **Button State**: Visual feedback on hover/click

### Responsive Design

- **Desktop**: Max-width 1024px, centered
- **Tablet**: Full width with padding
- **Mobile**: Optimized touch targets, stacked layout

### Accessibility Features

- Semantic HTML structure
- Proper ARIA labels
- Keyboard navigation support
- Focus management
- High contrast text

### Icons Used (Lucide React)

- `Bot`: AI assistant avatar
- `User`: User avatar
- `Send`: Send message button
- `Loader2`: Loading/streaming indicator

## Usage Tips

1. **Sending Messages**: Press Enter or click Send button
2. **Watching Responses**: Text appears in real-time as AI generates
3. **Multiple Messages**: Previous messages remain visible with scroll
4. **Visual Feedback**: Cursor shows active streaming, spinner shows loading
