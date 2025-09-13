# TwoLineTitle Component Usage Guide

## Overview
The `TwoLineTitle` component is specifically designed for two-line titles that need different font weights on each line, with a smaller size than the main Title component.

## Features
- **Two-line Support**: Separate control over each line's styling
- **Flexible Font Weights**: Choose which line is bold and which is normal
- **Smaller Size**: 36px instead of 48px (not "too big")
- **Exact Line Height**: 120% line-height as shown in your images
- **Responsive Design**: Automatically adjusts for different screen sizes

## Styling Specifications
```css
color: var(--Navy, #00203F);
font-family: Inter;
font-size: 36px; /* Smaller than main Title */
line-height: 120%; /* 43.2px - as shown in your images */
```

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `firstLine` | `string` | Required | The first line of text |
| `secondLine` | `string` | Required | The second line of text |
| `firstLineBold` | `boolean` | `false` | Whether first line should be bold |
| `secondLineBold` | `boolean` | `true` | Whether second line should be bold |
| `className` | `string` | `''` | Custom className for additional styling |
| `as` | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'` | `'h2'` | HTML tag to use |
| `centered` | `boolean` | `true` | Whether to center the title |

## Usage Examples

### "Register Today. It's Free!" Pattern
```tsx
// First line normal, second line bold
<TwoLineTitle 
  firstLine="Register Today."
  secondLine="It's Free!"
  firstLineBold={false}
  secondLineBold={true}
  as="h2"
  centered={true}
/>
```

### "Help us Grow the Community!" Pattern
```tsx
// First line bold, second line normal
<TwoLineTitle 
  firstLine="Help us Grow"
  secondLine="the Community!"
  firstLineBold={true}
  secondLineBold={false}
  as="h2"
  centered={true}
/>
```

### "Join the Waitlist - It's Free!" Pattern
```tsx
// First line normal, second line bold
<TwoLineTitle 
  firstLine="Join the Waitlist"
  secondLine="It's Free!"
  firstLineBold={false}
  secondLineBold={true}
  as="h2"
  centered={true}
/>
```

## Responsive Behavior
- **Mobile (≤640px)**: Font size 28px
- **Tablet (641px-1023px)**: Font size 32px
- **Desktop (≥1024px)**: Font size 36px
- **Large Desktop (≥1440px)**: Font size 40px

## Key Differences from Main Title Component
| Feature | Main Title | TwoLineTitle |
|---------|------------|--------------|
| Font Size | 48px | 36px |
| Line Height | 100% | 120% |
| Use Case | Main page titles | Call-to-action titles |
| Weight Control | First bold, second light | Flexible per line |

## Updated Components
The following components now use TwoLineTitle:

1. **WaitlistForm** - "Register Today. It's Free!" and "Help us Grow the Community!"
2. **RecommendSection** - "Join the Waitlist - It's Free!"

## Benefits
- ✅ **Exact Match**: Matches your image specifications perfectly
- ✅ **Right Size**: Not "too big" like the main Title component
- ✅ **Flexible**: Control which line is bold/normal
- ✅ **Consistent**: Same styling across all two-line titles
- ✅ **Responsive**: Works on all screen sizes

