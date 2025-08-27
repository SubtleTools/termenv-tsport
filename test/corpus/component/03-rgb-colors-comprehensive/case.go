package main

import (
	"fmt"

	"github.com/muesli/termenv"
)

func main() {
	// Force TrueColor profile for consistent testing
	out := termenv.NewOutput(nil, termenv.WithProfile(termenv.TrueColor))
	
	// Test basic RGB colors
	basicColors := []string{"#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFFFFF", "#000000"}
	colorNames := []string{"Red", "Green", "Blue", "Yellow", "Magenta", "Cyan", "White", "Black"}
	
	fmt.Println("--- Basic RGB Colors ---")
	for i, hex := range basicColors {
		color := termenv.RGBColor(hex)
		styled := out.String(colorNames[i]).Foreground(color)
		fmt.Printf("%s (%s)\n", styled, hex)
	}
	
	// Test RGB color variations
	fmt.Println("\n--- RGB Color Variations ---")
	variations := []string{"#FF8080", "#80FF80", "#8080FF", "#FFFF80", "#FF80FF", "#80FFFF", "#808080", "#C0C0C0"}
	
	for _, hex := range variations {
		color := termenv.RGBColor(hex)
		styled := out.String(fmt.Sprintf("Color %s", hex)).Foreground(color)
		fmt.Printf("%s\n", styled)
	}
	
	// Test 3-digit hex colors
	fmt.Println("\n--- 3-Digit Hex Colors ---")
	shortHex := []string{"#F00", "#0F0", "#00F", "#FF0", "#F0F", "#0FF", "#FFF", "#000"}
	
	for _, hex := range shortHex {
		color := termenv.RGBColor(hex)
		styled := out.String(fmt.Sprintf("Short %s", hex)).Foreground(color)
		fmt.Printf("%s\n", styled)
	}
	
	// Test background colors
	fmt.Println("\n--- Background RGB Colors ---")
	bgColors := []string{"#FF0000", "#00FF00", "#0000FF", "#808080"}
	
	for _, hex := range bgColors {
		color := termenv.RGBColor(hex)
		styled := out.String(fmt.Sprintf("BG %s", hex)).Background(color)
		fmt.Printf("%s\n", styled)
	}
}