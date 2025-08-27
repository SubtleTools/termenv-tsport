package main

import (
	"fmt"
	"os"
	"strings"

	"github.com/muesli/termenv"
)

var output strings.Builder

func init() {
	// Redirect output to capture it
	termenv.SetDefaultOutput(termenv.NewOutput(&output, termenv.WithProfile(termenv.TrueColor)))
}

func main() {
	
        s := termenv.String("Hello World").Foreground(termenv.RGBColor("#FF6B35"))
        output.WriteString(s.String())
        
	fmt.Print(output.String())
}
