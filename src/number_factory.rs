    use regex::Regex;

    #[derive(Debug)]
    pub struct NumberFactory<'a> {
        pub input: &'a str,
        dictionary: [&'a str; 37],
        tens_index: usize,
        huns_index: usize,
        pub conjunction: &'a str,
        pub negative_prefix: &'a str,
        pub decimal_prefix: &'a str,
        pub decimal_seperator: &'a str,
        pub thousands_seperator: &'a str,
    }

    impl <'a>NumberFactory<'a> {
        pub fn new(input: &'a str) -> Self {
            Self { 
                input, 
                dictionary: ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
                "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
                "twenty","thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety",
                "hundred", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion", "sextilion", "septillion",],
                tens_index: 20,
                huns_index: 28,
                conjunction: "and",
                negative_prefix: "negative",
                decimal_prefix: "point",
                decimal_seperator: ".",
                thousands_seperator: ",",       
            }
        }
        //
        // State
        //
        // get an array of single word numbers from the dictionary
        fn powers_of_1(&self) -> Vec<&str> { self.dictionary[..self.tens_index].to_vec() }
        //
        // get an array of tens words from the dictionary
        fn powers_of_10(&self) -> Vec<&str> {
            let mut tens = self.dictionary[self.tens_index..self.huns_index].to_vec();
            tens.reverse();
            tens.push(self.dictionary[10]);
            tens.push("");
            tens.reverse();
            tens
        }
        // get an array of words for multiples of 1000 from the dictionary
        fn powers_of_1000(&self) -> Vec<&str> { self.dictionary[self.huns_index..].to_vec() }
        //
        // functions
        //
        // check if a negative sign preceeds the input
        pub fn is_negative(&self, num: &str) -> bool { Regex::new(r"^-+").unwrap().is_match(&num) }


        /*
        Function to split input based on decimal_seperator into an array of 2 strings
        with some sensible checking
        */ 
        pub fn input_array(&self, num: &str) -> [String; 2] {
            let s = num.split(self.decimal_seperator).collect::<Vec<&str>>();
            let mut l = String::new();
            let mut r = String::new();
            match s.get(0) { Some(l0) => l.push_str(l0), None => {}, }
            match s.get(1) { Some(r0) => r.push_str(r0), None => {}, }
            // first part
            // remove preceeding sign and thousands_seperators
            l = Regex::new(r"^-+").unwrap().replace_all(
                &Regex::new(self.thousands_seperator).unwrap().replace_all(
                    &l, 
                    ""
                ).to_string(), ""
            ).to_string();
            if !Regex::new(r"^\d+$").unwrap().is_match(&l) {
                // must contain only digits
                // panic or empty string
                l = String::new();
            } else if Regex::new(r"^0+$").unwrap().is_match(&l) {
                // if it is all zeros make it one 0
                l = String::from("0")
            } else {
                // remove preceeding zeros
                l = Regex::new(r"^0+").unwrap().replace(&l, "").to_string()
            }
            // second part
            r = Regex::new(r"0+$").unwrap().replace_all(
                &Regex::new(self.thousands_seperator).unwrap().replace_all(
                    &r, 
                    ""
                ).to_string(), ""
            ).to_string();
            if !Regex::new(r"^\d+$").unwrap().is_match(&r) {
                // must contain only digits
                // panic or empty string
                r = String::new()
            }

            [l, r]
        }
        /*
        Function to split input into groups of 3 characters
        returns a vector array
        will ignore anything after the decimal point
        */
        pub fn thousands(&self, num: &str) -> Vec<String> {
            let n = self.input_array(num);

            let h = &Regex::new(r"^-+").unwrap().replace(
                &Regex::new(r"--").unwrap().replace_all(
                    &Regex::new(r"\d{3}").unwrap().replace_all(
                        &Regex::new(r"^(\d{1,3})((\d{3})+)$").unwrap().replace(
                            &n[0], 
                            "$1-$2"
                        ).to_string(),
                        "-$0"
                    ).to_string(),
                    "-"
                ).to_string(),
                ""
            ).to_string();

            h.split("-").map(|s| s.to_string()).collect::<Vec<String>>()
        }
        
        pub fn integer_words(&self, num: &str) -> String {

            // function tens
            // Expects any 2 digit number from 20 to 99 and converts it to words.
            // Be careful! It does not check the validity of input if you give it any
            // thing apart from a 2 digit number from 20 to 99, results will be useless.
            // check the inputs before calling it
            let under_100 = | num : &str | {
                if Regex::new(r"^.*[^0].{2}$").unwrap().is_match(&num) { 
                    panic!("number must be less than 100");
                }
                let no = num.parse::<usize>().unwrap();
                if no < 21 {
                    self.powers_of_1 ()[no].to_string()
                } else {
                    let xo = no / 10;
                    let ox = no % 10;
                    let yo = self.powers_of_10()[xo].to_string();
                    if ox == 0 {
                        yo
                    } else {
                        let oy = self.powers_of_1 ()[ox].to_string();
                        [ yo, oy ].join(" ")
                    }
                }
            };

            let under_1000 = | num : &str | {
                if Regex::new(r"^.*[^0].{3}$").unwrap().is_match(&num) { 
                    panic!("number must be less than 1000");
                }
                let noo = num.parse::<usize>().unwrap();
                if noo < 100 {
                    under_100(num)
                } else {
                    let xoo = noo / 100;
                    let oxx = noo % 100;
                    let hun = self.dictionary[self.huns_index].to_string();
                    let yoo = under_100(&xoo.to_string());
                    if oxx == 0 {
                        [ yoo, hun ].join(" ")
                    } else {
                        let con = self.conjunction.to_string();
                        let oyy = under_100(&oxx.to_string());
                        [ yoo, hun, con, oyy ].join(" ")
                    }
                }
            };

            let num0 = &self.input_array(num)[0];

            if Regex::new(r"^0*\d{3}$").unwrap().is_match(num0) {
                under_1000(num0)        
            } else {
                let mut result = self.thousands(num);
                let mils = self.powers_of_1000();
                result.reverse();

                for i in 0..result.len() {
                    let n = &result[i];
                    if n.parse::<usize>().unwrap() == 0 { result[i] = "".to_string(); continue; };
                    let w = Regex::new(r"zero").unwrap().replace(&under_1000(&n), "").to_string();
                    if i == 0 {
                        if Regex::new(r"0..$").unwrap().is_match(num) &&
                            !Regex::new(r"0+$").unwrap().is_match(num) {
                            result[i] = format!("{} {}", self.conjunction.to_owned(), &w); 
                        } else {
                            result[i] = w;
                        }
                    } else {
                        let m = if i >  mils.len()-1 { format!("E+{}", i*3) } else { mils[i].to_string() };
                        result[i] = format!("{} {},", &w, &m);
                    };
                }
                result.reverse();
                result.retain(|x| *x != "");
                let c = format!(" {} ", self.conjunction);
                let d = format!(",{}", c);
                Regex::new(r" +").unwrap().replace(
                    &Regex::new(&d).unwrap().replace(
                        &result.join(" "), 
                        &c
                    ).to_string(),
                    " "
                ).to_string().trim().to_string()

            }
        }

        pub fn decimal_words(&self, num: &str) -> String {
            let num1 = &self.input_array(num)[1];
            if !Regex::new(r"^\d+$").unwrap().is_match(num1) || 
                Regex::new(r"^0+$").unwrap().is_match(num1) {
                String::from("")
            } else {
                let mut dec: String = self.decimal_prefix.to_string();
                for c in Regex::new(r"0+$").unwrap().replace(num1,"").to_string().chars() {
                    dec = format!("{} {}", dec, self.powers_of_1()[c.to_digit(10).unwrap() as usize]);
                }
                dec.trim().to_string()
            }
        }

        pub fn convert_to_words(&self, num: &str) -> String {
            let l = self.integer_words(num);
            let r = self.decimal_words(num);

            if (l == "zero" || l == "") && r == "" {
                l.to_string().trim().to_string()
            } else {
                let mut result = l;
                if self.is_negative(num) { 
                    result = format!("{} {}",self.negative_prefix, &result); 
                }
                if r != "" { 
                    result = format!("{} {}", result, &r);
                }
                result.to_string().trim().to_string()
            }
        }

        pub fn words(&self) -> String { self.convert_to_words(self.input) }

    }