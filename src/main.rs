mod number_factory;
fn main() {
    let mut args = std::env::args().skip(1);
    let input = args.next().expect("No text was found");
    let a = number_factory::NumberFactory::new(&input);
    println!("{:?}", a.words());
}
