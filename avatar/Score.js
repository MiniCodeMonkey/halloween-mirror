import Timeout from 'await-timeout';

class Score {
  constructor(host) {
    this.host = host;
  }

  showCharacter() {
    document.getElementById('renderCanvas').classList.remove('invisible');
    document.getElementById('renderCanvas').classList.add('animate__animated');
    document.getElementById('renderCanvas').classList.add('animate__fadeIn');
    document.getElementById('renderCanvas').classList.add('animate__slow');
  }

  hideCharacter() {
    document.getElementById('renderCanvas').classList.remove('animate__fadeIn');
    document.getElementById('renderCanvas').classList.add('animate__fadeOut');
  }

  /**
   * Valid animation names: generic_a, generic_b, generic_c, in, many, one, self, wave, you
   **/
  animate(animation) {
    const defaultGestureOptions = {
      holdTime: 1.5, // how long the gesture should last
      minimumInterval: 0, // how soon another gesture can be triggered
    };

    this.host.GestureFeature.playGesture('Gesture', animation, defaultGestureOptions);
  }

  say(content) {
    this.isTalking = true;
    this.host.TextToSpeechFeature.play(`<speak><amazon:auto-breaths>${content}</amazon:auto-breaths></speak>`);
  }

  whisper(content) {
    this.say(`<amazon:effect name="whispered">${content}</amazon:effect>`);
  }

  async waitUntilDoneTalking() {
    while (this.isTalking) {
      console.log('Talking');
      await Timeout.set(100);
    }
    console.log('Done talking');
  }

  onStopSpeech() {
    this.isTalking = false;
  }

  async start() {
    this.host.listenTo(
      this.host.TextToSpeechFeature.EVENTS.pause,
      this.onStopSpeech.bind(this)
    );
    this.host.listenTo(
      this.host.TextToSpeechFeature.EVENTS.stop,
      this.onStopSpeech.bind(this)
    );

    this.showCharacter();

    this.whisper("Jeg tror ikke det er en go' idé at går dérind.");
    await this.waitUntilDoneTalking();

    this.hideCharacter();




    //this.host.GestureFeature.playGesture('Gesture', 'wave', defaultGestureOptions);
    //this.host.TextToSpeechFeature.play('I skovens dunkle og grusomme mørke findes væsner der lever i både vinter og tørke.');

    /*
    this.host.TextToSpeechFeature.play(`
<speak>
      <amazon:effect name="whispered">Hvem er du? Hurtigt! Kom her.</amazon:effect>

      <amazon:auto-breaths>
      <p>
        Godt du er her!
        <mark name='{"feature":"GestureFeature","method":"playGesture","args":["Emote", "cheer"]}'/>
      </p>

      <break />

      <p>
        Jeg har brug for din hjælp!
      </p>

      <p>Der er sluppet et monster fri i skoven!!!</p>
      
      <p>Det er sådan cirka så højt her.</p>
      <mark name='{"feature":"GestureFeature","method":"playGesture","args":["Gesture", "big", { "holdTime": 0.8, "minimumInterval": 0 }]}'/> 
      <p>Det har store røde øjne.</p>

      <break />

      <mark name='{"feature":"GestureFeature","method":"playGesture","args":["Gesture", "defense", { "holdTime": 0.8, "minimumInterval": 0 }]}'/> 
      <p>Det nåede at slippe væk fra mig sidst jeg var inde i skoven.</p>

      <mark name='{"feature":"GestureFeature","method":"playGesture","args":["Gesture", "heart", { "holdTime": 0.8, "minimumInterval": 0 }]}'/> 
      <p>Du må gerne hjælpe mig med at skræmme det væk. Baby Græskarerne er meget bange for det.</p>
      <p>Men pas på! Jeg ved ikke hvad det kan finde på at gøre.</p>

      <break />

      <p>God fornøjelse!</p>
      <mark name='{"feature":"GestureFeature","method":"playGesture","args":["Emote", "applause"]}'/>
      </amazon:auto-breaths>
</speak>`);
*/

    /*setTimeout(() => {
      this.host.GestureFeature.playGesture('Gesture', 'you', defaultGestureOptions);
      this.host.TextToSpeechFeature.play('Ja dig... Pas på! Skoven er mørk og der er fyldt med skrækkelige væsner.');

      setTimeout(() => {
        this.host.GestureFeature.playGesture('Gesture', 'aggressive', defaultGestureOptions);
      }, 2000);*/
  }
}

export default Score;