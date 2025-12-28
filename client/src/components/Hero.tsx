import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import purpleTextureImagePath from "@assets/image_1749701291052.png";

export default function Hero() {
  return (
    <section 
      className="hero-section"
      style={{
        position: 'relative',
        width: '100vw',
        height: 'clamp(400px, 66.67vh, 800px)',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        overflow: 'hidden',
        display: 'grid',
        placeItems: 'center'
      }}
    >
      {/* Video Background Layer */}
      <div 
        className="video-background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
      >
        <iframe
          src="https://www.youtube.com/embed/0PT6S_qNKk4?autoplay=1&mute=1&loop=1&playlist=0PT6S_qNKk4&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
          style={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            border: 'none',
            outline: 'none'
          }}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Purple texture overlay */}
      <div 
        className="texture-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${purpleTextureImagePath})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.6,
          zIndex: 2
        }}
      />

      {/* Dark overlay for text readability */}
      <div 
        className="dark-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          zIndex: 3
        }}
      />
      
      {/* Hero Content Layer */}
      <div 
        className="hero-content"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '1200px',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          textAlign: 'center'
        }}
      >
        <div 
          className="content-wrapper"
          style={{
            width: '100%',
            maxWidth: '900px',
            padding: '0 1rem'
          }}
        >
          <h1 
            className="hero-title"
            style={{
              fontSize: 'clamp(1.5rem, 5vw, 3.2rem)',
              fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              fontWeight: '800',
              letterSpacing: '-0.02em',
              color: 'white',
              lineHeight: '1.1',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
              marginBottom: 'clamp(2rem, 4vw, 3rem)',
              animation: 'slow-blink 4s ease-in-out infinite',
              textAlign: 'center'
            }}
          >
WATCHMEN PRAYER MOUVEMENT<br />
            FOR THE NATIONS
          </h1>
          
          <div 
            className="hero-buttons"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Button 
              asChild 
              className="hero-primary-btn"
              style={{
                backgroundColor: '#4F46E5',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: 'clamp(12px, 2.5vw, 16px) clamp(20px, 4vw, 32px)',
                fontSize: 'clamp(14px, 2.5vw, 16px)',
                fontWeight: '600',
                fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
                transition: 'all 0.2s ease',
                zIndex: 11,
                cursor: 'pointer',
                width: 'clamp(200px, 40vw, 280px)',
                textAlign: 'center'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#4338CA';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#4F46E5';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Link to="/login">Become A Watchman</Link>
            </Button>
            <Button 
              asChild 
              className="hero-secondary-btn"
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid white',
                borderRadius: '8px',
                padding: 'clamp(10px, 2.5vw, 14px) clamp(18px, 4vw, 30px)',
                fontSize: 'clamp(14px, 2.5vw, 16px)',
                fontWeight: '600',
                fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                transition: 'all 0.2s ease',
                zIndex: 11,
                cursor: 'pointer',
                width: 'clamp(200px, 40vw, 280px)',
                textAlign: 'center'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = 'black';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'white';
              }}
            >
              <Link to="/training">View Our Training</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
