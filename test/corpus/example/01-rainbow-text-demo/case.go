package main

import (
	"fmt"

	"github.com/muesli/termenv"
)

func main() {
	// Force TrueColor profile for best results
	out := termenv.NewOutput(nil, termenv.WithProfile(termenv.TrueColor))
	
	fmt.Println("--- Rainbow Text Demo ---")
	
	// Rainbow colors
	colors := []string{
		"#FF0000", // Red
		"#FF7F00", // Orange
		"#FFFF00", // Yellow
		"#00FF00", // Green
		"#0000FF", // Blue
		"#4B0082", // Indigo
		"#9400D3", // Violet
	}
	
	text := "RAINBOW"
	
	// Create rainbow text
	rainbow := ""
	for i, char := range text {
		color := termenv.RGBColor(colors[i%len(colors)])
		styled := out.String(string(char)).Bold().Foreground(color)
		rainbow += fmt.Sprintf("%s", styled)
	}
	
	fmt.Printf("Rainbow Text: %s\n", rainbow)
	
	// Rainbow with gradient background
	fmt.Println("\n--- Rainbow with Background ---")
	rainbowBg := ""
	for i, char := range text {
		fgColor := termenv.RGBColor(colors[i%len(colors)])
		bgColor := termenv.RGBColor("#000080") // Navy background
		styled := out.String(string(char)).Bold().Foreground(fgColor).Background(bgColor)
		rainbowBg += fmt.Sprintf("%s", styled)
	}
	
	fmt.Printf("Rainbow with BG: %s\n", rainbowBg)
	
	// Different styles for each letter
	fmt.Println("\n--- Varied Styles ---")
	styles := []func(termenv.Style) termenv.Style{
		func(s termenv.Style) termenv.Style { return s.Bold() },
		func(s termenv.Style) termenv.Style { return s.Italic() },
		func(s termenv.Style) termenv.Style { return s.Underline() },
		func(s termenv.Style) termenv.Style { return s.Overline() },
		func(s termenv.Style) termenv.Style { return s.Reverse() },
		func(s termenv.Style) termenv.Style { return s.Blink() },
		func(s termenv.Style) termenv.Style { return s.CrossOut() },
	}
	
	variedStyles := ""
	for i, char := range text {
		color := termenv.RGBColor(colors[i%len(colors)])
		styled := out.String(string(char)).Foreground(color)
		styled = styles[i%len(styles)](styled)
		variedStyles += fmt.Sprintf("%s", styled)
	}
	
	fmt.Printf("Varied Styles: %s\n", variedStyles)
	
	// Create a border
	fmt.Println("\n--- Border Demo ---")
	border := out.String("═══════════════════").Bold().Foreground(termenv.RGBColor("#00FFFF"))
	fmt.Printf("%s\n", border)
	
	centeredText := out.String("  TERMENV DEMO  ").Bold().Foreground(termenv.RGBColor("#FFFFFF")).Background(termenv.RGBColor("#FF0080"))
	fmt.Printf("%s\n", centeredText)
	
	fmt.Printf("%s\n", border)
}