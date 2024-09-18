export const displaySize = (val?: number|string) => {
    if (val) {
        let num = val
        if (typeof num == 'string') {
            num = parseFloat(val as string)
        }

        if (num >= 20000) { // jug
            return `${val}ml (${(num / 20000).toFixed(2) + " jug"})` 
        }else if (num >= 1000) { //liter
            return `${val}ml (${(num / 1000).toFixed(2) + " liter"})`
        }else { // ml
            return `${val}ml` 
        }
    }
    return ""
}