package main

import (
	"fmt"

	"github.com/muesli/termenv"
)

func main() {
	// Test global convenience functions
	fmt.Println(termenv.String("Global Red").Foreground(termenv.RGBColor("#FF0000")))
	fmt.Println(termenv.String("Global Blue").Bold().Foreground(termenv.RGBColor("#0000FF")))
	
	// Test ANSI colors
	fmt.Println(termenv.String("ANSI Red").Foreground(termenv.ANSIColor(1)))
	fmt.Println(termenv.String("ANSI Blue").Foreground(termenv.ANSIColor(4)))
}