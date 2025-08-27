package main

import (
	"fmt"

	"github.com/muesli/termenv"
)

func main() {
	// Force TrueColor profile for consistent testing
	out := termenv.NewOutput(nil, termenv.WithProfile(termenv.TrueColor))
	
	// Test basic color rendering
	red := out.String("Red Text").Foreground(out.Color("#FF0000"))
	blue := out.String("Blue Text").Foreground(out.Color("#0000FF"))
	green := out.String("Green Text").Foreground(out.Color("#00FF00"))
	
	fmt.Println(red)
	fmt.Println(blue)  
	fmt.Println(green)
}