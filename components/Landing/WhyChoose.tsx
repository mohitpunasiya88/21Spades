export default function WhyChoose() {
    const features = [
      {
        title: 'CURATED PREMIUM CONTENT',
        description: 'Lorem ipsum dolor sit amet consectetur. Morbi vestibulum et odio aliquam. Id fringilla non ducantur. Neque eget cursus laoreet pharetra. Feugiat hac turpis.'
      },
      {
        title: 'VIBRANT COMMUNITY SUPPORT',
        description: 'Lorem ipsum dolor sit amet consectetur. Morbi vestibulum et odio aliquam. Id fringilla non ducantur. Neque eget cursus laoreet pharetra. Feugiat hac turpis.'
      },
      {
        title: 'SECURE AND TRANSPARENT',
        description: 'Lorem ipsum dolor sit amet consectetur. Morbi vestibulum et odio aliquam. Id fringilla non ducantur. Neque eget cursus laoreet pharetra. Feugiat hac turpis.'
      },
      {
        title: 'BLAZING FAST TRANSACTION',
        description: 'Lorem ipsum dolor sit amet consectetur. Morbi vestibulum et odio aliquam. Id fringilla non ducantur. Neque eget cursus laoreet pharetra. Feugiat hac turpis.'
      }
    ];
  
    return (
      <section className="py-20 bg-gradient-to-b from-gray-900 via-purple-950 to-gray-950 relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-white text-4xl">♠</div>
  
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-yellow-400" style={{ fontFamily: 'system-ui, sans-serif', letterSpacing: '0.05em' }}>
                Why Choose Our Platform
              </h2>
              <p className="text-gray-400 text-lg">
                Lorem ipsum dolor sit amet consectetur. Malesuada venenatis morbi nibh libero
              </p>
            </div>
  
            <div className="relative border-2 border-blue-500 rounded-2xl p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="relative">
                    <h3 className="text-purple-400 text-lg font-bold mb-3" style={{ letterSpacing: '0.1em' }}>
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
  
                    {index === 0 && (
                      <div className="absolute -top-6 -right-6 text-blue-400">
                        <svg width="40" height="40" viewBox="0 0 40 40">
                          <line x1="0" y1="20" x2="40" y2="20" stroke="currentColor" strokeWidth="2" strokeDasharray="4,4" />
                          <line x1="20" y1="0" x2="20" y2="40" stroke="currentColor" strokeWidth="2" strokeDasharray="4,4" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
  
              <div className="mt-12 text-center">
                <div className="inline-block bg-blue-500 text-black font-bold px-6 py-2 rounded-lg text-lg">
                  1036 × 529 Hug
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  