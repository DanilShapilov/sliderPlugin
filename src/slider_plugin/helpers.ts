export function generateRangeArr(range: number[] | string[], step: number, generateValues: boolean):string[] {
    if (range.length === 2 && ckeckTypeForRange(range) && generateValues) {
        (range as Array<number | string>) = rangeGenerator(range[0], range[1])
    } else if (range.length === 2 && !ckeckTypeForRange(range) && generateValues) {
        throw new Error('SliderPlugin: If you want to "generateValues", all elements of provided range array should have same type: string or number')
    }

    const rangeToString: string[] = 
    (range as Array<number | string>)
        .filter( (_el, index) => (index % step) === 0)
        .map( el => String(el))
        
    return rangeToString
}

function rangeGenerator<T extends number | string>(start: T,stop: T) {
    const shouldBeReversed = start > stop;
    if (shouldBeReversed) {
        [start, stop] = [stop, start];
    }
    let result=[];

    if (typeof start === 'string' && typeof stop === 'string') {
        const excludeChars = ['[', ']', '^', '_', '`', '\\']
        for (let idx=start.charCodeAt(0),end=stop.charCodeAt(0); idx <=end; ++idx){
            const charToPush = String.fromCharCode(idx);
            if (!excludeChars.includes(charToPush)) {
                result.push(charToPush)
            }
        }
    } else if (typeof start === 'number' && typeof stop === 'number') {
        for (let i:number = start; i <= stop; i++) {
            result.push(i);
        }
    }

    
    return shouldBeReversed ? result.reverse() : result;
};

function ckeckTypeForRange(range: number[] | string[]) {
    if ((typeof range[0] === 'string' || typeof range[0] === 'number') 
    && (typeof range[1] === 'string' || typeof range[1] === 'number')) {
        return typeof range[0] === typeof range[1]
    }
    return false
}

export function deepCopy(obj: object) {
    return JSON.parse(JSON.stringify(obj))
}