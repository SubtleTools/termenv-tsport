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
	
        link := termenv.Hyperlink("https://example.com", "Example Link")
        output.WriteString(link)
        
	fmt.Print(output.String())
}
