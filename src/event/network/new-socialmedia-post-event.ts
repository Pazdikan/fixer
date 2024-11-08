import { GameContextType } from "@/core/core.types";
import { Event } from "../event";
import { eventEmitter } from "@/common/lib/event-emitter";
import { Character } from "@/character/character.types";

// Enum for message types
enum MessageType {
  NORMAL = "Normal",
  GIG_POTENTIAL = "Gig-Potential",
  GIG_POTENTIAL_FAKE = "Gig-Potential (Fake)"
}

export class NewSocialMediaPostEvent implements Event {
  getID(): string {
    return "new-social-media-post";
  }
  getName(): string {
    return "New Social Media Post";
  }
  getDescription(): string {
    return "Someone has posted something on social media!";
  }
  getChance(): number {
    return 0.7;
  }
  shouldExecute(game: GameContextType): boolean {
    return true;
  }

  // Function to generate a random message type
  private getRandomMessageType(): MessageType {
    const randomValue = Math.random();
    if (randomValue < 0.5) {
      return MessageType.NORMAL;
    } else if (randomValue < 0.75) {
      return MessageType.GIG_POTENTIAL;
    } else {
      return MessageType.GIG_POTENTIAL_FAKE;
    }
  }

  // Function to generate a random post based on message type
  private generateRandomPost(character: Character): string {
    const messageType = this.getRandomMessageType();

    const normalMessages = [
        "Just got back from the market. Nothing special, just another day in the big city.",
        "Had a rough day, but it's nothing a good drink can't fix.",
        "Woke up to a new job. Hope it's easy money.",
        "City's always noisy, but it’s home.",
        "Looking for a little excitement, maybe tonight’s the night.",
        "Had to make a quick getaway today, but I'm fine.",
        "You ever feel like you're stuck in the same loop? Me neither...",
        "It's a quiet day, too quiet. Something’s coming, I can feel it.",
        "If you’re reading this, then I survived another day in this crazy place.",
        "Another job done, but it’s not enough. When is it ever enough?",
        "The streets are alive tonight. Who’s out there with me?",
        "Met some interesting people today. Maybe they can help me with the next gig.",
        "Just another run-in with the law. Getting too old for this.",
        "Every day feels like a hustle. And that’s just how I like it.",
        "Heard some whispers today. Could be something big coming.",
        "The city’s always got something to offer, you just need to know where to look.",
        "Got a message from an old contact. Wonder what they want now.",
        "Had a couple of drinks. Still not enough to drown the thoughts.",
        "Met a person with an interesting offer. Could be worth checking out.",
        "Sometimes the city feels like a prison, but the walls are always shifting.",
        "Back from a run, looking for the next one.",
        "Some gigs are too clean. I prefer the messy ones.",
        "My head's still spinning from last night's job. Need to lay low for a while.",
        "Business as usual. Just need the right connection to make a big score.",
        "It's all about finding the right people in the right places.",
        "The more you hustle, the more the city gives back. Or so they say.",
        "I love the smell of danger in the air. Makes the job that much more interesting.",
        "Another day, another deal. It's a constant grind, but it keeps the lights on.",
        "Had a late-night run last night. The adrenaline is still high.",
        "Sometimes I wonder if there’s an end to all this. But that’s the game.",
        "A quiet night is a rare thing. Still looking for something to spice it up.",
        "Everything’s for sale in this city. You just need to know the price.",
        "They say the best deals happen in the dark. Let's see if that’s true.",
        "Back from a risky job. I’m starting to feel like I might retire soon.",
        "Sometimes I think I’ve seen it all. But the city always has something new.",
        "I got a feeling something big is coming. Maybe I’ll be ready for it.",
        "Another deal, another day. I’ll take it.",
        "Not much time for reflection. Just on to the next thing.",
        "Ain’t no rest for the wicked. And I’m getting wicked good at this.",
        "Some people play the game for the thrill. Me? I play for the cash.",
        "Every city has its rules. But some of us don’t play by them.",
        "The good jobs are always the dangerous ones. That’s what makes them worth doing.",
        "Don’t ask questions. Just take the job and get paid.",
        "Had a run-in with some old faces today. Wonder if they remember me.",
        "Another night, another chance to make something happen.",
        "I love how the city always gives you a second chance. If you’re smart enough to take it.",
        "The streets are full of rats. Good thing I’m not one of them.",
        "A quiet day, but something tells me that won’t last.",
        "Just another day in paradise. If you can call it that.",
        "Got a job coming up. Could be dangerous, but what isn’t?",
        "They’re calling me for a gig. Hope it’s not another dead end.",
        "If you're out there hustling, you better be prepared to get dirty."
    ];

    const gigPotentialMessages = [
        "Need someone to steal a prototype from a high-security lab. Cash on delivery. DM if you're up for it.",
        "Looking for a crew to hit a corporate convoy. High payout, high risk. Who’s in?",
        "Got a job that requires some skill. Let’s talk if you’re interested.",
        "There’s a rich target in town. If you’ve got the right gear, we’ll make a fortune.",
        "Got a dirty job for someone who knows their way around a secure facility. DM me.",
        "Could use a few hands for a delicate job. Big payout at the end. Let’s talk.",
        "Someone needs a little extraction done. No questions asked, just results.",
        "Looking for a hacker with the skills to crack a high-end system. You in?",
        "I need a reliable muscle for a job. Pay's good if you can get the job done.",
        "Need someone to retrieve a package from a heavily guarded location. DM for details.",
        "Looking for an experienced cleaner to take care of a small mess. Money talks.",
        "Got a risky gig lined up. If you’re willing to take the chance, hit me up.",
        "A corporate target needs to disappear. Pay’s high for the right person.",
        "Need someone who’s good at getting in and out without leaving a trace. DM me.",
        "Looking for an expert in hacking. If you know your way around encrypted systems, hit me up.",
        "Got a run through the underworld. It’s gonna get messy, but the reward’s worth it.",
        "Looking for someone to sabotage a high-security project. You’ll be well compensated.",
        "Need a clean getaway driver for an upcoming job. Bonus if you’ve got some muscle to back you up.",
        "Got a high-paying gig, but it’s risky. DM me if you’ve got the guts to pull it off.",
        "I need a team for a high-stakes heist. If you’re up for it, let’s talk.",
        "Looking for a specialist to deal with a small problem. Your skills for my money.",
        "Got a job that’s gonna require all kinds of talents. Are you the one I need?",
        "Got a quick and dirty job. You in?",
        "I’ve got a target that needs to be neutralized. If you’re the right person, you’ll get paid.",
        "Got a message from a client. Need someone to recover a stolen item. Big reward for the right person.",
        "Looking for a quick extraction job. No questions, just results.",
        "I need someone who knows how to make a deal disappear. If you’re that person, DM me.",
        "There's a prototype in a high-security lab that needs to disappear. Got the skills to pull it off?",
        "I’m looking for a fixer to handle a delicate situation. Pay’s good if you’re discreet.",
        "Need a hacker who’s not afraid to go deep. There’s money in it for you.",
        "Got a job that involves some... unsavory characters. If you’re into that, hit me up.",
        "Looking for someone to help clean up a mess. Discretion is key.",
        "I need a team to break into a corporate building. It's gonna be a hard job, but worth the payout.",
        "Looking for a solo op to extract an asset. You’ll get paid handsomely for it.",
        "Need someone to take care of an ex-corp employee. Simple job, big payout.",
        "Got a job lined up that requires some special skills. Think you’re the one for it?",
        "Looking for a strong team to take down a target. This could get messy.",
        "I need someone who can handle a little… persuasion. High stakes, but even higher rewards.",
        "Got a job in a high-security zone. Only pros need apply.",
        "Need someone who can handle a run-in with corporate security. It’s a quick job, but high reward.",
        "Got a job involving a sensitive target. If you’re capable, we can talk numbers.",
        "Looking for an expert to hack into a secured facility. You in?",
        "Need someone for a clean extraction job. No questions asked."
    ];

    const gigPotentialFakeMessages = [
        "Looking for someone to buy me a beer, DM.",
        "Who wants to grab a drink? I’m buying… maybe.",
        "In the mood for some company tonight. Anyone up for it?",
        "Looking for a little fun tonight. No strings attached.",
        "Need someone to hang out with for a bit. Hit me up.",
        "Anyone up for a game of cards tonight?",
        "Looking to relax. Anyone up for some downtime?",
        "If you're not busy, how about grabbing a drink?",
        "Anyone else just in it for the chill vibes tonight?",
        "Need someone to talk to. It’s been a rough day.",
        "Looking for a bit of company. DM me if you’re interested.",
        "Anyone want to grab a drink and chat? Let me know.",
        "I need someone to just hang out with. It’s been a long day.",
        "I’m bored. Someone hit me up for a little fun.",
        "Anyone up for some low-key fun tonight?",
        "Looking for someone to play some pool with. You in?",
        "It’s a good night for a drink. Who’s down?",
        "Anyone want to kick back and watch a movie?",
        "Looking for a wingman tonight. DM me.",
        "Anyone into karaoke tonight? Let’s have some fun.",
        "Looking for some no-strings fun tonight. Hit me up.",
        "Anyone want to meet up for a late-night drink?",
        "Feeling like taking it easy tonight. Who’s in?",
        "Anyone want to join me for a walk around the city?",
        "Looking for someone to unwind with after a long day.",
        "Anyone want to go grab a drink and shoot the breeze?",
        "Just in the mood for some casual company. Anyone around?",
        "Looking for someone to enjoy the night with. Let me know.",
        "Anyone into low-key hangouts? Let’s do something chill.",
        "Who’s down for some drinks and a little bit of trouble?",
        "Just trying to relax tonight. Any takers?",
        "Need someone to hang out with for a while. DM me.",
        "Anyone want to grab some food and chill for a bit?",
        "Looking for someone to just relax and chat. Hit me up.",
        "Anyone up for a little fun tonight?",
        "Looking for someone to kill time with. DM me.",
        "If you want to meet up for a drink or two, let me know.",
        "Just looking for a quiet night. Anyone else feel that?",
        "Anyone up for a casual chat over a drink?",
        "Got some downtime. Who wants to kill some time together?",
        "Anyone into just having a chill time tonight?"
    ];

    switch (messageType) {
      case MessageType.NORMAL:
        return this.getRandomMessageFromArray(normalMessages);
      
      case MessageType.GIG_POTENTIAL:
        return this.getRandomMessageFromArray(gigPotentialMessages);
      
      case MessageType.GIG_POTENTIAL_FAKE:
        return this.getRandomMessageFromArray(gigPotentialFakeMessages);
      
      default:
        return "Random message with no type.";
    }
}

private getRandomMessageFromArray(messages: string[]): string {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
}


  execute(game: GameContextType): void {
    const character = game.gameState.characters[Math.floor(game.generator.rng() * game.gameState.characters.length)];

    const newPost = {
      id: `${new Date().toISOString()}_${character.id}`,
      content: this.generateRandomPost(character),
      timestamp: new Date().toISOString(),
      author_id: character.id,
    };

    eventEmitter.emit(this.getID(), newPost);
  }
}
