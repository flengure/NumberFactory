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
    
    def ones(number):
        return words[ones_index + int(number)]
    

    def tens(number):
        number_string = str(number)
        tens_digit = int(number_string[0:1])
        unit_digit = int(number_string[1])
        result = words[tens_index + tens_digit -2]
        if unit_digit > 0 :
            return ' '.join([result, ones(unit_digit)])

        return result
    
    
    def hundreds(number):
        number_string = str(number)
        hundreds_digit = int(number_string[0:1])
        tens_remainder = int(number_string[1:])
        result = ones(hundreds_digit) + ' ' + words[huns_index]
        if tens_remainder > 0 :
            if tens_remainder < 21 :
                return ' '.join([result, 'and', ones(tens_remainder)])
            else :
                return ' '.join([result, 'and', tens(tens_remainder)])
    
        return result


    def underThousands(number_input):
        import re
        if re.search("^1?[0-9]$", str(number_input)) :
            return ones(number_input)
                
        if re.search("^[2-9][0-9]$", str(number_input)) :
            return tens(number_input)
                
        if re.search("^[0-9][0-9][0-9]$", str(number_input)) :
            return hundreds(number_input)

    def overThousands(number_input):
        number_string = str(number_input)
        number_length = len(number_string)
        number_words_index = ((number_length-1)//3)-1
        thousands_index = number_length-2
        if number_words_index >= len(words) - mils_index :
            words_string = str(words).replace()
            txt ="this number is too big for me, consider adding to this list in the code \n words like {}" 
            return txt.format(words)
        mils_name = words[mils_index + number_words_index]
        right_length = ((number_length - 1)//3)*3
        left_length = number_length - right_length
        left_string = number_string[0 : left_length]
        right_string = number_string[-right_length : ]
        if int(left_string) > 0 :
            result = " ".join([underThousands(left_string), mils_name ])
            if int(right_string) > 999 :
                return ", ".join([ result, overThousands(right_string)])
        
            if int(right_string) > 99 :
                return ", ".join([ result, underThousands(right_string)])
        
            if int(right_string) > 0 :
                return ' '.join([ result, ' and ', underThousands(right_string)])
      
        return result
    

    if len(str(number_input)) < 4 :
        return underThousands(number_input)
    else :
        
        return overThousands(number_input) 

        
            

       
    
    

   


if __name__ == "__main__":
    print(main())