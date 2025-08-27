package main

import (
	"fmt"
	"strings"

	"github.com/muesli/termenv"
)

var output strings.Builder

func init() {
	// Redirect output to capture it
	termenv.SetDefaultOutput(termenv.NewOutput(&output, termenv.WithProfile(termenv.TrueColor)))
}

func main() {
	
        s := termenv.String("Complex").
          Foreground(termenv.RGBColor("#FF0000")).
          Background(termenv.RGBColor("#00FF00")).
          Bold().
          Underline().
          Italic()
        output.WriteString(s.String())
        
	fmt.Print(output.String())
}
