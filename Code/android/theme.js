/**
 * HLIMS Official Universal Theme Dictionary
 * 
 * If the hospital administration ever wants to tweak the "Look and Feel",
 * you ONLY have to change the HEX codes in this file. The entire Android
 * App will instantly synchronize across every single screen.
 */

export const theme = {
    // The core branding colors
    primary: '#0284c7',       // Trust Blue (Headers, Primary Buttons)
    secondary: '#10b981',     // Medical Emerald (Success States, Submit Buttons)
    accent: '#f59e0b',        // Warning Amber (Pending actions, Discrepancies)
    danger: '#ef4444',        // Critical Red (Errors, Missing Items)

    // The canvas / surfaces
    background: '#f8fafc',    // The main screen surface behind everything
    card: '#ffffff',          // The floating white containers

    // Typography
    textMain: '#0f172a',      // Primary headers and vital text
    textMuted: '#64748b',     // Subtitles and descriptive blurbs

    // Structural
    border: '#e2e8f0',        // Soft outlines for cards and input boxes
    radius: 10,               // Standard corner roundness for the whole app
    elevation: 3              // Standard shadow depth
};
