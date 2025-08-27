import "fmt"; import "github.com/muesli/termenv"; func main() { c := termenv.RGBColor("#9400D3"); fmt.Printf("RGB: %d,%d,%d", int(c.R()*255), int(c.G()*255), int(c.B()*255)) }
