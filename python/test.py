import sys
def main():
    if len(sys.argv) < 2:
        print ("No number provided")
        quit()

    number_input = sys.argv[1]

    # the french are a strange bunch, they swap these two, we will default to English here
    decimal_separator = '.'
    words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 
        'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 
        'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 
        'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety',
        'hundred', 'thousand', 'million', 'billion', 'trillion', 
        'quadrillion', 'quintillion', 'sextillion']
    ones_index = 0   # all the single letter words start at index 0 to index 20
    tens_index = 20  # 2 letter number prefixes start here
    huns_index = 28  # the word hundred, kind of an odd man out
    mils_index = 29 # all the powers of 1000 start here keep adding to your hearts delight

    def fractions(number):
        if float(number) == 0 :
            return
        number_string = str(number)
        result = 'point'
        for x in number_string:
            result += ' ' + words[ones_index + int(x)]
        return result

    print (fractions("5676"))

   


if __name__ == "__main__":
    main()