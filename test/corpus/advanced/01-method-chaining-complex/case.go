package main

import (
	"fmt"

	"github.com/muesli/termenv"
)

func main() {
	// Force TrueColor profile for consistent testing
	out := termenv.NewOutput(nil, termenv.WithProfile(termenv.TrueColor))
	
	fmt.Println("--- Complex Method Chaining Test ---")
	
	// Test progressive chaining
	base := out.String("Progressive Chaining")
	step1 := base.Bold()
	step2 := step1.Italic()
	step3 := step2.Underline()
	step4 := step3.Foreground(termenv.RGBColor("#FF0000"))
	final := step4.Background(termenv.RGBColor("#FFFF00"))
	
	fmt.Printf("Base: %s\n", base)
	fmt.Printf("Step 1 (Bold): %s\n", step1)
	fmt.Printf("Step 2 (+ Italic): %s\n", step2)
	fmt.Printf("Step 3 (+ Underline): %s\n", step3)
	fmt.Printf("Step 4 (+ Red FG): %s\n", step4)
	fmt.Printf("Final (+ Yellow BG): %s\n", final)
	
	// Test all-in-one chaining
	allInOne := out.String("All In One Chain").
		Bold().
		Italic().
		Underline().
		Overline().
		Blink().
		Reverse().
		CrossOut().
		Foreground(termenv.RGBColor("#00FF00")).
		Background(termenv.RGBColor("#FF00FF"))
	
	fmt.Printf("All in One: %s\n", allInOne)
	
	// Test chaining with different color types
	ansiChain := out.String("ANSI Chain").
		Bold().
		Foreground(termenv.ANSIColor(2)).
		Background(termenv.ANSIColor(5))
	
	ansi256Chain := out.String("ANSI256 Chain").
		Italic().
		Underline().
		Foreground(termenv.ANSI256Color(196)).
		Background(termenv.ANSI256Color(21))
	
	rgbChain := out.String("RGB Chain").
		Faint().
		Overline().
		Foreground(termenv.RGBColor("#FF8C00")).
		Background(termenv.RGBColor("#4B0082"))
	
	fmt.Printf("ANSI Chain: %s\n", ansiChain)
	fmt.Printf("ANSI256 Chain: %s\n", ansi256Chain)
	fmt.Printf("RGB Chain: %s\n", rgbChain)
	
	// Test chaining order independence
	order1 := out.String("Order Test 1").
		Foreground(termenv.RGBColor("#FF0000")).
		Bold().
		Background(termenv.RGBColor("#0000FF"))
	
	order2 := out.String("Order Test 2").
		Bold().
		Background(termenv.RGBColor("#0000FF")).
		Foreground(termenv.RGBColor("#FF0000"))
	
	fmt.Printf("Order 1 (FG-Bold-BG): %s\n", order1)
	fmt.Printf("Order 2 (Bold-BG-FG): %s\n", order2)
}